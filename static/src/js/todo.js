/** @odoo-module  **/

import publicWidget from '@web/legacy/js/public/public_widget';
import { useService } from "@web/core/utils/hooks";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { renderToElement } from "@web/core/utils/render"

publicWidget.registry.todo = publicWidget.Widget.extend({
    'selector': '#add_todo',
    'template':'Leon_Todo.viewtodo',
    'events': {
        'change #input1':'_alert_change',
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
        this.effect = this.bindService("effect")
        this.rpc=this.bindService('rpc')
        
        
    },

    async start() {
        
    },
    
    async _update_todo_html(ev){
        ev.preventDefault();
      
        
        await this.rpc("/create_todo", {
            task_title: this.$el.find("#input1").val(),
            id:this.$el.find("#role").val(),
            status:this.$el.find("#input2").val()
        }).then((result)=> {
            this.status=result.status
            this.notification.add(this.status, {
                type: "info",
                
              });
        })
        
        const content = renderToElement(this.template, {
            string: "QWEB Tutorials using Javascript",
            array: [1,2,3,4,5],
            todos:await this.orm.searchRead("leon.todo", [], ["task_title","status"]),
            email: "ajscriptmedia@gmail.com",
        })
        
        this.$('#todo_list_view').replaceWith(content);
        this.$el.find("#input1").val("")
        this.$('#update_save').text("save");

        this.$el.find("#role").val("0")


    },
    _oneClickCheckBox(event) {
        console.log("Do you want ", this.$el.value);
        var $button = $(event.currentTarget);
        console.log($button)
        var attrValue = $button.attr('value');
        
        console.log('Attribute value:', attrValue);
        
        this.dialog.add(ConfirmationDialog,{
            title:"please confirm",
            body:"are you usure to delete it ?",
            confirm:()=>{
                alert("we wiil delete");
            },
            cancel:()=>{alert("cancelled")},
            hide:()=>{alert("nice")}
        
        }
            );
    


    }, 
    _alert_change(event) {
        console.log("Do you want ", this.$el.find("#input1").val());
       
    },
    _save_todo(event){

        
          this.$('#upp').html("<h2> here we go</h2>");

    },
    async _delete_todo(event){
        this.current_todo = await  this.orm.searchRead("leon.todo", [["id","in",[$(event.currentTarget).attr('value')]]], ["task_title","status"])

        this.dialog.add(ConfirmationDialog,{
            title:"please confirm",
            body:"are you sure to delete task #"+this.current_todo[0].task_title,
            
            confirm:async ()=>{
                await this.rpc("/delete_todo", {
                    id: $(event.currentTarget).attr('value'),
                }).then(function (result) {
                    console.log(result)
                });

        this.notification.add("Task Deleted!", {
            type: "danger",
            
          });
        const content = renderToElement(this.template, {
            todos:await this.orm.searchRead("leon.todo", [], ["task_title"]),
        })
        
        this.$('#todo_list_view').replaceWith(content);
            },
            cancel:()=>{alert("cancelled")},
            hide:()=>{alert("nice")}
        
        }
            );
        
        
    },

   async _edit_todo(event){
    this.current_todo = await  this.orm.searchRead("leon.todo", [["id","in",[$(event.currentTarget).attr('value')]]], ["task_title","status"])
    this.$el.find("#input1").val(this.current_todo[0].task_title)
    this.$el.find("#input2").val(this.current_todo[0].status)
    this.$el.find("#role").val(this.current_todo[0].id)
    this.$('#update_save').text("update");
    $('html, body').animate({scrollTop: 0}, 'fast');

    
   }

});


export default publicWidget.registry.todo;
