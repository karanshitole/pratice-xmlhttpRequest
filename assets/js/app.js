const cl= console.log;

const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl= document.getElementById('content');
const userIdControl= document.getElementById('userId');
const cardContainer = document.getElementById('cardContainer');
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")
const loader= document.getElementById('loader');



const baseUrl= `https://post-crud-a459f-default-rtdb.asia-southeast1.firebasedatabase.app/`;
const postUrl= `${baseUrl}/posts.json`;
const onDelete=(ele)=>{
    Swal.fire({
        title: "Do you want to remove this post?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText:` Don't remove`
    })
    .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            cl(ele);
            let deleteId = ele.closest(".card").id;
            cl(deleteId)
            let DeleteUrl =`${baseUrl}/posts/${deleteId}.json`
            makeApiCall("DELETE",DeleteUrl)
            .then(res=>{
        
                // cl(res)
                document.getElementById(deleteId).remove()
                Swal.fire({
                    title: `Post is deleteded successfully !!!`,
                    icon: `success`,
                    timer: 2000
                 })

            })
            .catch(err=> cl(err))
            .finally(()=>{
                loader.classList.add("d-none")
            })
        }
        })
    }
   
    


const onEdit=(ele)=>{
    cl(ele)
    let editId=ele.closest(".card").id;
    localStorage.setItem("editId",editId)
    let editUrl = `${baseUrl}/posts/${editId}.json`;

    makeApiCall("GET", editUrl)
    .then(res=>{
        // cl(res)
        titleControl.value=res.title;
        contentControl.value=res.content;
        userIdControl.value=res.userId;
        submitBtn.classList.add('d-none');
        updateBtn.classList.remove('d-none');

    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        loader.classList.add("d-none")
    })
}
const createCard =(obj)=>{
    let card = document.createElement("div");
    card.classList="card mb-4";
    card.id=obj.id;
    card.innerHTML= `
    
    <div class="card-header">
                    <h4 class="m-0">${obj.title}</h4>
                </div>
                <div class="card-body">
                    <p class="m-0">${obj.content}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                </div>   `
        cardContainer.append(card)
}

 const templatingofCard = (arr)=>{
    arr.forEach(obj=>{
        createCard(obj)
    });
 }
const makeApiCall=(methodName, apiUrl, msgbody=null)=>{
 return new Promise((resolve, reject)=>{
    loader.classList.remove("d-none")
    let xhr = new XMLHttpRequest();
    xhr.open(methodName,apiUrl)
    xhr.setRequestHeader("content-type","Application/json");
    xhr.send(JSON.stringify(msgbody));
    xhr.onload= function(){
        if(xhr.status>=200&&xhr.status<300){
            resolve(JSON.parse(xhr.response))
        }else{
            reject('something went worng!!!')
        }
    }
 })
}



const fetchPost=()=>{
    makeApiCall("GET", postUrl)
    .then(res=>{
        cl(res);
        let postArr =[];
        for(const key in res){
            // cl(res[key])
            let obj = {...res[key], id:key};
            // obj.id=key;
            postArr.push(obj);
            // cl(postArr)
           
        }
        templatingofCard(postArr)
    })
    .catch(err=> cl(err))
    .finally(()=>{
        loader.classList.add("d-none")
    })
}
fetchPost();

const onpostSubmit=(event)=>{
    event.preventDefault();
    let obj ={
        title: titleControl.value,
        content:contentControl.value,
        userId:userIdControl.value
    }

    makeApiCall("POST", postUrl, obj)
    .then(res=>{
        // cl(res)
        obj.id=res.name;
        createCard(obj)
        Swal.fire({
            title: `Post is submited successfully !!!`,
            icon: 'success',
            timer: 2000
         })

       
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        postForm.reset();
        loader.classList.add("d-none");
    })
}
const onPostUpdate=()=>{
    let updatedObj={
        title:titleControl.value,
        content:contentControl.value,
        userId:userIdControl.value
    }
    cl(updatedObj)
    let updateId=localStorage.getItem("edited");
    let updateUrl=`${baseUrl}/posts/${updateId}.json`

    makeApiCall("PATCH",updateUrl,updatedObj)
    .then((res)=>{
        cl(res)
        res.id=updateId
        let card =[... document.getElementById(res.id).children];
        cl(card)
        card[0].innerHTML=`<h4 class="m-0">${res.title}</h4>`;
        card[1].innerHTML=`<p class="m-0">${res.contrnt}</p>`;
        Swal.fire({
            title: 'Post is updated successfully !!!',
            icon: success,
            timer: 2000
         })

    })
    .catch((err)=>{
        cl(err)
    })
    .finally(()=>{
        postForm.reset();
        updateBtn.classList.add("d-none")
        submitBtn.classList.remove("d-none")
     loader.classList.add("d-none")
    })
}
postForm.addEventListener("submit", onpostSubmit)
updateBtn.addEventListener("click",onPostUpdate)


let obj = {
    userId1:{
        title:"test 1",
        content:"Test 1"
        
    }
}