from odoo import http
from odoo.http import request
import json


class AddPartnerController(http.Controller):

    @http.route('/create_todo', type='json', auth='user', website=True, csrf=False)
    def create_todo(self, **post):
        print(post)
        todo = request.env['leon.todo'].sudo().browse(int(post.get('id')))
        del post['id']
        if todo:
            todo.write(post)
            return {"status":"Task Updated"}
        todo_task=request.env['leon.todo'].sudo().create(post)
        return {
            "status":"Task Added"
        }
    @http.route('/todo', type='http', auth='user', website=True, csrf=False)
    def get_todos(self, **post):
        return request.render("Leon_Todo.viewtodo",{
            "todos":request.env['leon.todo'].search([])
        })
    @http.route('/delete_todo', type='json', auth='user', website=True, csrf=False)
    def delete_todo(self, **post):
       print(post)
       record = request.env['leon.todo'].sudo().browse(int(post.get('id')))
       if record:
        record.unlink()
        return True
       else:
            return False
       
    @http.route('/edit_todo', type='json', auth='user', website=True, csrf=False)
    def edit_todo(self, **post):
       print(post)
       record = request.env['leon.todo'].sudo().browse(int(post.get('id')))
       if record:
        record.write({"task_title":post.get()})
        return True
       else:
            return False