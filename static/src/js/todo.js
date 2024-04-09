/** @odoo-module  **/

import publicWidget from '@web/legacy/js/public/public_widget';
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { renderToElement } from "@web/core/utils/render"
import { session } from '@web/session';

publicWidget.registry.todo = publicWidget.Widget.extend({
    'selector': '#add_todo',
    'template':'Leon_Todo.viewtodo',
    'events': {
        
        'submit':'_update_todo_html',
        'click .delete':'_delete_todo',
        'click .edit':'_edit_todo',

    },
    init(parent, options) {
        this._super(...arguments);
        this.count=0;
        this.orm = this.bindService("orm");
        this.notification=this.bindService("notification")
        this.dialog=this.bindService("dialog")
        this.rpc=this.bindService('rpc')
        
        
    },

    async start() {
        this.user_id=await session.user_id

    },
    
    async _update_todo_html(ev){
        ev.preventDefault();
      
        
        await this.rpc("/create_todo", {
            task_title: this.$el.find("#input1").val(),
            id:this.$el.find("#role").val(),
            important:this.$el.find("#important").prop("checked"),
            status:this.$el.find("#input2").val()
        }).then((result)=> {
            this.status=result.status
            this.notification.add(this.status, {
                type: "info",
                
              });
        })
        
        const content = renderToElement(this.template, {
            todos:await this.orm.searchRead("leon.todo", [['create_uid','=',this.user_id]], ["task_title","status","important"]),
        })
        
        this.$('#todo_list_view').replaceWith(content);
        this.$el.find("#input1").val("")
        this.$el.find("#input2").val("pending")
        this.$('#update_save').text("save");
        this.$el.find("#important").prop('checked',false)

        this.$el.find("#role").val("0")


    },
    async _delete_todo(event){
        this.current_todo = await  this.orm.searchRead("leon.todo", [["id","in",[$(event.currentTarget).attr('value')]]], ["task_title","status"])

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

        
        const content = renderToElement(this.template, {
            todos:await this.orm.searchRead("leon.todo", [], ["task_title","status","important"]),
        })
        
        this.$('#todo_list_view').replaceWith(content);
            },
            cancel:()=>{},
            hide:()=>{}
        
        }
            );
        
        
    },

   async _edit_todo(event){
    this.current_todo = await  this.orm.searchRead("leon.todo", [["id","in",[$(event.currentTarget).attr('value')]]], ["task_title","status","important"])
    this.$el.find("#input1").val(this.current_todo[0].task_title)
    this.$el.find("#input2").val(this.current_todo[0].status)
    this.$el.find("#role").val(this.current_todo[0].id)
    this.$('#update_save').text("update");
    this.$el.find("#important").prop('checked',this.current_todo[0].important)

    $('html, body').animate({scrollTop: 0}, 'fast');

    
   }

});


export default publicWidget.registry.todo;
