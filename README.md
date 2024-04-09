# CRUD Application in Odoo

## Introduction

This repository contains a comprehensive guide to developing a CRUD (Create, Read, Update, Delete) application in Odoo. By following this guide, you will gain a solid understanding of Odoo website development, covering JavaScript controllers, models, RPC calls, asset usage, notifications, and dialogs.

## Table of Contents

1. [Setting Up the Development Environment](#setting-up-the-development-environment)
2. [Creating the Model](#creating-the-model)
3. [Creating the Controller](#creating-the-controller)
4. [Implementing JavaScript](#implementing-javascript)
   
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
- When developing your application, it's essential to create controllers to handle various functionalities.
- These controller functions are annotated with decorators and mapped to specific routes.
- Each function within the controller must have a unique name.
- Controllers can serve as endpoints to process requests or render pages by passing additional information as context.
- The `type` attribute specifies the return type of the controller, while `auth` determines whether access is public or restricted to authenticated users.

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
## Implementing JavaScript

Create JavaScript files in the static directory commonly static/src/js and add in your manifest file by defolt those js and css file will beloaded when the page loaded so there is no further configuration in xml file
```python
 'assets': {
        'web.assets_frontend': [
            'Leon_Todo/static/src/xml/todo.xml',
            'Leon_Todo/static/src/js/todo.js',
            'Leon_Todo/static/src/scss/styles.css',
        ],
```
there are modules that we need to import for this app

```js
import publicWidget from '@web/legacy/js/public/public_widget';
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { renderToElement } from "@web/core/utils/render"
import { session } from '@web/session';
```

The Widget class is really an important building block of the user interface. Pretty much everything in the user interface is under the control of a widget. The Widget class is defined in the module web.Widget, in widget.js.
```js
import publicWidget from '@web/legacy/js/public/public_widget';
publicWidget.registry.todo = publicWidget.Widget.extend({
       'selector': '#add_todo',
   init(parent, options) {
        this._super(...arguments);
      }
  async start() {
      // code when your page is starting
    },
/// add other functions here
})
export default publicWidget.registry.todo;
```
### Handling CRUD Operations

## Performing RPC Calls

Learn about Remote Procedure Calls (RPC) and make asynchronous calls to the Odoo server.
you have to initaialize init method
```js
 init(parent, options) {
        this._super(...arguments);
        this.count=0;
        this.orm = this.bindService("orm");
        this.notification=this.bindService("notification")
        this.dialog=this.bindService("dialog")
        this.rpc=this.bindService('rpc')
        
        
    },
```
```js
this.rpc("/create_todo", {
            task_title: this.$el.find("#input1").val(),
            id:this.$el.find("#role").val(),
            important:this.$el.find("#important").prop("checked"),
            status:this.$el.find("#input2").val()
        }).then((result)=> {
}
```
```js

todos = await this.orm.searchRead("leon.todo", [['create_uid','=',this.user_id]], ["task_title","status","important"])
console.log(todos)

```
## Querying Data from JavaScript

Fetch data from Odoo models, filter, sort, and display it in the frontend. using orm service from odoo

## Utilizing Odoo Assets

Manage static assets like CSS and JavaScript, integrate external libraries, and optimize asset loading for performance.

## Implementing Notifications and Dialogs

Display success/error messages, create custom dialogs for user interaction, and enhance user experience with feedback mechanisms.
```js
this.notification.add("Task is deleted", {
                        type: "danger",
                        
                      });
```
```js


 this.dialog.add(ConfirmationDialog,{
            title:"please confirm",
            body:"are you sure to delete task #"+this.current_todo[0].task_title,
           
           
            confirm:async ()=>{
                await this.rpc("/delete_todo", {
                    id: $(event.currentTarget).attr('value'),
                }).then((result)=> {
                    this.notification.add(result.status, {
                        type: "danger",
                        
                      });
                });
```
## Conclusion

Congratulations on completing the guide! You now possess the skills to develop robust web applications within the Odoo framework. Keep exploring and refining your development skills to create even more powerful applications in Odoo.
