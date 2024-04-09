from odoo import http
from odoo.http import request
import json


class TodoWebController(http.Controller):

    @http.route('/create_todo', type='json', auth='user', website=True, csrf=False)
    def create_todo(self, **post):
        todo = request.env['leon.todo'].sudo().browse(int(post.get('id')))
        del post['id']
        if todo:
            user_id = http.request.env.user.id
            if user_id !=todo.create_uid.id:
                return {"status":"You are not allowed"}
               
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
       record = request.env['leon.todo'].sudo().browse(int(post.get('id')))
       user_id = http.request.env.user.id
       print(user_id,record.create_uid)
       if user_id !=record.create_uid.id:
          return {"status":"You are not allowed"}
       if record:
        record.unlink()
        return {"status":"Task deleted"}
       else:
            return {"status":"The record doesn't exist"}
   