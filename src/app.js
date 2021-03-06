import { http } from "./http";
import {ui} from "./ui"
// DOM events
document.addEventListener('DOMContentLoaded',getPosts);
document.querySelector('.post-submit').addEventListener('click',submitPost);
document.querySelector('#posts').addEventListener('click',deletePost);
document.querySelector('#posts').addEventListener('click',edit);
document.querySelector('.card-form').addEventListener('click',cancelEdit)


function getPosts(){
    http.get('http://localhost:3000/posts')
    .then(data => ui.showPosts(data))
    .catch(err=> console.log(err))
}

// submit post
function submitPost(){
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;
    const data = {
        title,
        body
    }

    if(title === '' || body === ''){
        ui.showAlert('Please fill in all fields','alert alert-danger');
    }else{
        if(id === ''){
             // create post request
        http.post('http://localhost:3000/posts',data)
        .then(data => {
            ui.showAlert('post added','alert alert-success');
            ui.clearFields()
            getPosts();
        })
        .catch(err=> console.log(err));
        }else{
            // update post 
            http.put(`http://localhost:3000/posts/${id}`,data)
        .then(data => {
            ui.showAlert('post added','alert alert-success');
            ui.changeFormState('add')
            getPosts();
        })
        }
    }  
}

// delete post
function deletePost(e){
    e.preventDefault();
    if(e.target.parentElement.classList.contains('delete')){
        const id = e.target.parentElement.dataset.id;
        if(confirm('Are you sure ?')){
            http.delete(`http://localhost:3000/posts/${id}`)
            .then(data => {
                ui.showAlert('Post removed','alert alert-success');
                getPosts();
            })
            .catch(err=>console.log(err))
        }
    }
}
  
// edit state
function edit(e){
    if(e.target.parentElement.classList.contains('edit')){
        const id = e.target.parentElement.dataset.id;
        const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        const body =  e.target.parentElement.previousElementSibling.textContent;
        // console.log(title,id)
        const data = {
            id,
            title,
            body
        }
        // fill form with current post
        ui.fillForm(data);
    }
    e.preventDefault()
}

// cancel edit state
function cancelEdit(e){
    if(e.target.classList.contains('post-cancel')){
        ui.changeFormState('add');
    }
    e.preventDefault();
}