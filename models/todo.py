from odoo import api, models, fields
class LeonTodo(models.Model):
    _name = "leon.todo"
    _description = "Todo Management"
    _order='id desc'
    task_title = fields.Char(string='Task Title', required=True)
    description = fields.Text(string='Description')
    category_id = fields.Many2one('your.module.category', string='Category')
    due_date = fields.Datetime(string='Due Date')
    completed_date = fields.Datetime(string='Completed Date')
    created_date = fields.Datetime(string='Created Date', default=lambda self: fields.Datetime.now())
    user_id = fields.Many2one('res.users', string='User')
    important = fields.Boolean(string='Important', default=False)
    status = fields.Selection([
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('in_progress', 'In Progress')],
        string='Status', default='pending')

