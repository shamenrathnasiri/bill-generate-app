from flask import Blueprint, jsonify
from models import db, Bill, Customer, Service
from sqlalchemy import func, extract
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('', methods=['GET'])
def get_dashboard_stats():
    """Return all dashboard statistics in a single call."""
    try:
        today = datetime.utcnow().date()
        current_month = today.month
        current_year = today.year

        # --- Core counts ---
        total_customers = Customer.query.filter_by(is_deleted=False).count()
        total_services = Service.query.filter_by(is_deleted=False).count()
        total_bills = Bill.query.filter_by(is_deleted=False).count()

        # --- Revenue ---
        total_revenue = (
            db.session.query(func.coalesce(func.sum(Bill.total), 0))
            .filter(Bill.is_deleted == False)
            .scalar()
        )

        # This month revenue
        month_revenue = (
            db.session.query(func.coalesce(func.sum(Bill.total), 0))
            .filter(
                Bill.is_deleted == False,
                extract('month', Bill.date) == current_month,
                extract('year', Bill.date) == current_year,
            )
            .scalar()
        )

        # This month bills count
        month_bills = (
            Bill.query.filter(
                Bill.is_deleted == False,
                extract('month', Bill.date) == current_month,
                extract('year', Bill.date) == current_year,
            ).count()
        )

        # --- Paid / Unpaid ---
        paid_bills = Bill.query.filter_by(is_deleted=False, is_paid=True).count()
        unpaid_bills = Bill.query.filter_by(is_deleted=False, is_paid=False).count()

        paid_amount = (
            db.session.query(func.coalesce(func.sum(Bill.total), 0))
            .filter(Bill.is_deleted == False, Bill.is_paid == True)
            .scalar()
        )
        unpaid_amount = (
            db.session.query(func.coalesce(func.sum(Bill.total), 0))
            .filter(Bill.is_deleted == False, Bill.is_paid == False)
            .scalar()
        )

        # --- Monthly revenue for last 6 months ---
        monthly_revenue = []
        for i in range(5, -1, -1):
            # Calculate month/year going back i months
            d = today.replace(day=1) - timedelta(days=i * 30)
            m, y = d.month, d.year
            rev = (
                db.session.query(func.coalesce(func.sum(Bill.total), 0))
                .filter(
                    Bill.is_deleted == False,
                    extract('month', Bill.date) == m,
                    extract('year', Bill.date) == y,
                )
                .scalar()
            )
            month_name = d.strftime('%b')
            monthly_revenue.append({'month': month_name, 'year': y, 'revenue': float(rev)})

        # --- Recent bills (last 5) ---
        recent_bills = (
            Bill.query
            .filter_by(is_deleted=False)
            .order_by(Bill.created_at.desc())
            .limit(5)
            .all()
        )

        # --- Top 5 customers by total billed ---
        top_customers_q = (
            db.session.query(
                Customer.id,
                Customer.name,
                func.coalesce(func.sum(Bill.total), 0).label('total_billed'),
                func.count(Bill.id).label('bill_count'),
            )
            .join(Bill, Bill.customer_id == Customer.id)
            .filter(Customer.is_deleted == False, Bill.is_deleted == False)
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(Bill.total).desc())
            .limit(5)
            .all()
        )
        top_customers = [
            {
                'id': c.id,
                'name': c.name,
                'total_billed': float(c.total_billed),
                'bill_count': c.bill_count,
            }
            for c in top_customers_q
        ]

        # --- Top services by usage ---
        from models import BillItem
        top_services_q = (
            db.session.query(
                Service.id,
                Service.name,
                func.count(BillItem.id).label('usage_count'),
                func.coalesce(func.sum(BillItem.line_total), 0).label('total_earned'),
            )
            .join(BillItem, BillItem.service_id == Service.id)
            .join(Bill, Bill.id == BillItem.bill_id)
            .filter(Service.is_deleted == False, Bill.is_deleted == False)
            .group_by(Service.id, Service.name)
            .order_by(func.count(BillItem.id).desc())
            .limit(5)
            .all()
        )
        top_services = [
            {
                'id': s.id,
                'name': s.name,
                'usage_count': s.usage_count,
                'total_earned': float(s.total_earned),
            }
            for s in top_services_q
        ]

        # --- New customers this month ---
        new_customers_month = (
            Customer.query.filter(
                Customer.is_deleted == False,
                extract('month', Customer.created_at) == current_month,
                extract('year', Customer.created_at) == current_year,
            ).count()
        )

        return jsonify({
            'success': True,
            'data': {
                'total_customers': total_customers,
                'total_services': total_services,
                'total_bills': total_bills,
                'total_revenue': float(total_revenue),
                'month_revenue': float(month_revenue),
                'month_bills': month_bills,
                'new_customers_month': new_customers_month,
                'paid_bills': paid_bills,
                'unpaid_bills': unpaid_bills,
                'paid_amount': float(paid_amount),
                'unpaid_amount': float(unpaid_amount),
                'monthly_revenue': monthly_revenue,
                'recent_bills': [b.to_dict() for b in recent_bills],
                'top_customers': top_customers,
                'top_services': top_services,
            },
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
        }), 500
