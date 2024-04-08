# CRUD Application in Odoo

## Introduction

This repository contains a comprehensive guide to developing a CRUD (Create, Read, Update, Delete) application in Odoo. By following this guide, you will gain a solid understanding of Odoo website development, covering JavaScript controllers, models, RPC calls, asset usage, notifications, and dialogs.

## Table of Contents

1. [Setting Up the Development Environment](#setting-up-the-development-environment)
2. [Creating the Model](#creating-the-model)
3. [Implementing JavaScript Controllers](#implementing-javascript-controllers)
4. [Performing RPC Calls](#performing-rpc-calls)
5. [Querying Data from JavaScript](#querying-data-from-javascript)
6. [Utilizing Odoo Assets](#utilizing-odoo-assets)
7. [Implementing Notifications and Dialogs](#implementing-notifications-and-dialogs)
8. [Conclusion](#conclusion)

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

## Implementing JavaScript Controllers

Create JavaScript files to handle CRUD operations and interact with Odoo models. the requests are done via rpc but you can use ajax or others


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
