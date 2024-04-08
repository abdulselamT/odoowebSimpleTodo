# CRUD Application in Odoo

## Introduction

This repository contains a comprehensive guide to developing a CRUD (Create, Read, Update, Delete) application in Odoo. By following this guide, you will gain a solid understanding of Odoo website development, covering JavaScript controllers, models, RPC calls, asset usage, notifications, and dialogs.

## Table of Contents

1. [Setting Up the Development Environment](#setting-up-the-development-environment)
2. [Creating the Model](#creating-the-model)
3. [Creating the Controller](#creating-the-controller)
4. [Implementing JavaScript Controllers](#implementing-javascript-controllers)
4.1. - [Subtopic: Handling CRUD Operations](#subtopic-handling-crud-operations)
4.2. - [Subtopic: Handling CRUD Operations](#subtopic-handling-crud-operations)
6. [Performing RPC Calls](#performing-rpc-calls)
7. [Querying Data from JavaScript](#querying-data-from-javascript)
8. [Utilizing Odoo Assets](#utilizing-odoo-assets)
9. [Implementing Notifications and Dialogs](#implementing-notifications-and-dialogs)
10. [Conclusion](#conclusion)

## Setting Up the Development Environment

clone the repository and add to your addons and install
## Creating the Model
Define the structure of your model and add fields for CRUD operations.
```python
from odoo import api, models, fields
class LeonTodo(models.Model):
    _name = "leon.todo"
    _description = "Todo Management"
    _order='id desc'
    task_title = fields.Char(string='Task Title', required=True)
    created_date = fields.Datetime(string='Created Date', default=lambda self: fields.Datetime.now())
    user_id = fields.Many2one('res.users', string='User')
    important = fields.Boolean(string='Important', default=False)
    status = fields.Selection([
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('in_progress', 'In Progress')],
        string='Status', default='pending')
```
## Creating The Controller
you will have to create controller
```python
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
   ```
## Implementing JavaScript Controllers

Create JavaScript files to handle CRUD operations and interact with Odoo models. the requests are done via rpc but you can use ajax or others
### Handling CRUD Operations

## Performing RPC Calls

Learn about Remote Procedure Calls (RPC) and make asynchronous calls to the Odoo server.

## Querying Data from JavaScript

Fetch data from Odoo models, filter, sort, and display it in the frontend. using orm service from odoo

## Utilizing Odoo Assets

Manage static assets like CSS and JavaScript, integrate external libraries, and optimize asset loading for performance.

## Implementing Notifications and Dialogs

Display success/error messages, create custom dialogs for user interaction, and enhance user experience with feedback mechanisms.

## Conclusion

Congratulations on completing the guide! You now possess the skills to develop robust web applications within the Odoo framework. Keep exploring and refining your development skills to create even more powerful applications in Odoo.
