# CRUD Web Application in Odoo

## Introduction

This repository contains a comprehensive guide to developing a CRUD (Create, Read, Update, Delete) application in Odoo. By following this guide, you will gain a solid understanding of Odoo-17 website development, covering JavaScript controllers, models, RPC calls, asset usage, notifications, and dialogs.

## Table of Contents

1. [Setting Up the Development Environment](#setting-up-the-development-environment)
2. [Creating the Model](#creating-the-model)
3. [Creating the Controller](#creating-the-controller)
4. [Implementing JavaScript](#implementing-javascript)
6. [Performing RPC Calls](#performing-rpc-calls)
7. [Querying Data from JavaScript and rendering](#querying-data-from-javascript-and-rendering)
8. [Utilizing Odoo Assets](#utilizing-odoo-assets)
9. [Implementing Notifications and Dialogs](#implementing-notifications-and-dialogs)
10. [Conclusion](#conclusion)

## Setting Up the Development Environment

clone the repository and add to your addons and install and it is odoo-17
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

Create JavaScript files within the static directory, typically located at static/src/js. Include these files in your manifest file by default. As a result, these JavaScript and CSS files will automatically load when the page loads, requiring no additional configuration in the XML file.

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

- The Widget class is a crucial element in the user interface, controlling most UI components.
- It is defined within the web.Widget module in widget.js.
- The selector key is utilized to select IDs from your XML.
- Events are represented as a dictionary in the class, mapping CSS selectors to methods that are triggered by specific actions like clicks or changes.
- Examples demonstrating these concepts can be found in the repository.

```js
import publicWidget from '@web/legacy/js/public/public_widget';
publicWidget.registry.todo = publicWidget.Widget.extend({
       'selector': '#add_todo',
       'events':{
}
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

## Querying Data from JavaScript and rendering

Fetch data from Odoo models, filter, sort, and display it in the frontend. using orm service from odoo
```jsREADME.md

todos = await this.orm.searchRead("leon.todo", [['create_uid','=',this.user_id]], ["task_title","status","important"])
console.log(todos)

```
what will do if the form is submmitted to prevent the page refreshing
- we block refreshuing via event listner
```js
  'events': {
        'submit':'_update_todo_html',
  }
  ```
when the form is submitted _update_todo_html will be called
- request to the  controller  to save data via rpc
- notify user based on response
- after that the page must be updated with the new element to do this we have xml file in the static /src/xml
- we render it with giving contexts and we wil append to the xml that are in views directory with id todo_list_view
  static/src/xml/todo.xml
```html
<?xml version="1.0" encoding="UTF-8"?>
<templates id="leonTemplate" xml:space="preserve">
<t t-name="Leon_Todo.viewtodo">
              <tbody id="todo_list_view">
              <t t-set="counter" t-value="1"/>
               <tr t-foreach="todos" t-as="todo" t-key="el">
                  <th scope="row"><t t-esc="counter"/></th>
                  <t t-set="counter" t-value="counter + 1"/>
                  <td t-attf-class="{{todo.important ? 'isimportant' : 'isnotimportant'}}" t-out="todo.task_title"/>
                  <td t-out="todo.status"/>
                  <td style="display:flex;gap:20px;">
                    <button  type="button" t-att-value="todo.id" class="btn btn-danger delete">Delete</button>
                    <button  type="button" t-att-value="todo.id" class="btn btn-primary edit">Edit</button>

                  </td>
                </tr>
              </tbody>
           
              
</t>
</templates>
``` 
 views/todo.xml not (full code) the file are not mandatory to be the same 
 ```html
   <tbody id="todo_list_view">
               <t t-set="counter" t-value="1"/>
               <tr t-foreach="todos" t-as="todo" t-key="el">
                  <th scope="row"><t t-esc="counter"/></th>
                  <t t-set="counter" t-value="counter + 1"/>
                  <td t-att-class="('isimportant' if todo.important else 'isnotimportant')" t-out="todo.task_title"/>
                  <td t-out="todo.status"/>
                  <td style="display:flex;gap:20px;">
                    <button  type="button" t-att-value="todo.id" class="btn btn-danger delete">Delete</button>
                    <button  type="button" t-att-value="todo.id" class="btn btn-primary edit">Edit</button>

                  </td>README.md
                </tr>
              </tbody>
 ```
```js
 async _update_todo_html(ev){
        ev.preventDefault();
      
        
        await this.rpc("/create_todo", {
            task_title: this.$el.find("#input1").valREADME.md),
            id:this.$el.find("#role").val(),
            important:this.$el.find("#important").prop("checked"),
            status:this.$el.find("#input2").val()
        }).then((result)=> {
            this.status=result.status
            this.notification.add(this.status, {
                type: "info",
                
              });
        })
        
        const content = renderToElement("Leon_Todo.viewtodo", {
            todos:await this.orm.searchRead("leon.todo", [['create_uid','=',this.user_id]], ["task_title","status","important"]),
        })
        
        this.$('#todo_list_view').replaceWith(content);
       

        this.$el.find("#role").val("0")


    },
```

## Utilizing Odoo Assets

Manage static assets like CSS and JavaScript, integrate external libraries, and optimize asset loading for performance.
those assets will automatically loaded to check activate developer mode with debug assets 
examople css file in repo
```css
`    .isimportant{
        color:blue;
}

```

## Implementing Notifications and Dialogs

Display success/error messages, create custom dialogs for user interaction, and enhance user experience with feedback mechanisms.
```js
this.notification.add("Task is deleted", {
                        type: "danger",
                        
                      });
```
```js


 this.dialog.add(ConfirmationDialog,{
            title:"please confirm",README.md
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

Congratulations on completing the guide! You now possess the skills to develop  web applications within the Odoo framework. now try to understand all code snippets in the repo.
