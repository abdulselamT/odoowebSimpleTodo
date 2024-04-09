{
    'name': 'Web Todo',
    'version': '1.0',
    'summary': 'Odoo Website Todo',
    'description': """
        enables you understand odoo website
    """,
    'category': 'Custom',
    'author': 'Leon/Abdulselam.M',
    'website': 'https://abdulselamt.github.io/portfolio/home.html',
    'license': 'AGPL-3',
    'depends': ['base', 'portal', 'web', 'website'],
    'data': [
        'security/ir.model.access.csv',
        'views/todo.xml',
        'views/website_menus.xml',
    ],
    
    'installable': True,
    'auto_install': False,
    'assets': {
        'web.assets_frontend': [
            'Leon_Todo/static/src/xml/todo.xml',
            'Leon_Todo/static/src/js/todo.js',
            'Leon_Todo/static/src/scss/styles.css',
        ],
    }
}
