const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const card = document.querySelector('#book-list');
let fav = {};
let lenght =  0;


const setupUI = (user) => {
    if(user){
        loggedInLinks.forEach(i => i.style.display = 'block');
        loggedOutLinks.forEach(i => i.style.display = 'none');
    }else{
        loggedInLinks.forEach(i => i.style.display = 'none');
        loggedOutLinks.forEach(i => i.style.display = 'block');
    }
}

//setup guides
const setupGuides = (data) => {
    
    if(data.length){
        let html = `
        <li>
        <div class="collapsible-header grey lighten-4">Loading}</div>
        <div class="collapsible-body white">Loading</div>
        </li>
        `;
        // fa.forEach(f => {
        //     const li = `
        //     <li>
        //     <div class="collapsible-header grey lighten-4">${data[f].title}</div>
        //     <div class="collapsible-body white">${data[f].title}</div>
        //     </li>
        //     `;
        
        //     html += li;
        // });
        
        guideList.innerHTML = html;
    }else{
        guideList.innerHTML = '<h5 class="center-align">Login To add fav books</h5>'
    }
    
}

const getFav2 = user => {
    
    if(user){
        db.collection("books")
        .get()
        .then(function(querySnapshot) {
            let books = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                books.push(doc.data());
            });
            
            db.collection("fav").where("user", "==", user)
            .get()
            .then(function(qs) {
                let html = '';
                let count = 0;

                qs.forEach(function(dc) {
                    const li = `
                    <li>
                    <div class="collapsible-header grey lighten-4">
                    
                    ${books[dc.data().bookid].title}
                    
                    </div>
                    <div class="collapsible-body white">
                        <div class="row">
                            <div class="col s4 m3">
                                <img src="${books[dc.data().bookid].img}" style="max-width:150px" alt="">
                                </div>
                                <div class="col s9">
                                <h4>${books[dc.data().bookid].title}</h4>
                                <p>${books[dc.data().bookid].description}</p>
                                <p>Category: ${books[dc.data().bookid].category}</p>
                                <p>PDF LINK : <a href="${books[dc.data().bookid].pdf}">Link</a></p>
                                <a href="#" class="waves-effect waves-light btn-small red" onClick="removeFav(${dc.data().bookid}, '${user}')">Remove</a>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12 m12 l12" style="height: 500px">
                                <object data="${books[dc.data().bookid].pdf}" type="application/pdf" width="100%" height="100%">
                                    <p><b>Example fallback content</b>: This browser does not support PDFs. Or Pdf link not availble for this time. 
                                </object>
                            </div>
                        </div>
                    </div>
                    </li>
                    `;
                    html += li;
                    count += 1;
                });
                if(count == 0){
                    html = "There's no book added";  
                }
                guideList.innerHTML = html;
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
    
}

const getFav = (user) =>{
    
    
    
    axios.get(`https://us-central1-elib-bb434.cloudfunctions.net/app/fav/api/read/${user}`)
    .then(function (response) {
        fav = response.data.books;
        
        
        axios.get(`https://us-central1-elib-bb434.cloudfunctions.net/app/books/api/read`).then(function (res){
        let books = res.data;
        let html = '';
        
        if(fav.length > 0){
            fav.forEach(f => {
                const li = `
                <li>
                <div class="collapsible-header grey lighten-4">
                
                ${books[f].title}
                
                </div>
                <div class="collapsible-body white">
                <div class="row">
                <div class="col s4 m3">
                <img src="${books[f].img}" style="max-width:150px" alt="">
                </div>
                <div class="col s9">
                <h4>${books[f].title}</h4>
                <p>${books[f].description}</p>
                <p>Category: ${books[f].category}</p>
                <p>PDF LINK : <a href="${books[f].pdf}">Link</a></p>
                <a href="#" class="waves-effect waves-light btn-small red" onClick="removeFav(${f}, '${user}')">Remove</a>
                </div>
                </div>
                </div>
                </li>
                `;
                html += li;
                length += 1;
            });
        }else{
            html = "There's no book added";
        }
        
        
        guideList.innerHTML = html;
    }).catch(function (err){
        console.log(err);
    });
    
})
.catch(function (error) {
    
    console.log(error);
})
.then(function () {
    
});
}


const getBook = stat =>{
    // Make a request for a user with a given ID
    axios.get('https://us-central1-elib-bb434.cloudfunctions.net/app/books/api/read')
    .then(function (response) {
        // handle success
        let html = ''
        
        if(stat){
            response.data.forEach( d => {
                html += `
                <tr>
                <td>
                <img width="100px" src="${d.img}" alt="">
                </td>
                <td>${d.title}</td>
                <td>${d.description.slice(0, 50)}...</td>
                <td><span class="new badge" data-badge-caption="${d.category}"></span></td>
                <td>
                <a class="waves-effect waves-light btn-small logged-in blue darken-2" onClick="addFav(${d.id})">Add</a>
                </td>
                </tr>
                `;
            });
        }else{
            response.data.forEach( d => {
                html += `
                <tr>
                <td>
                <img width="100px" src="${d.img}" alt="">
                </td>
                <td>${d.title}</td>
                <td>${d.description.slice(0, 50)}...</td>
                <td><span class="new badge" data-badge-caption="${d.category}"></span></td>
                <td>
                Login to add book
                </td>
                </tr>`;
            });
        }
        
        
        card.innerHTML = html;
        var table = new DataTable('#my-tbl',{
            sortable: false
        });
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
    
    
    
}

const getFavLength = (user) => {
    
    axios.get('https://us-central1-elib-bb434.cloudfunctions.net/app/fav/api/read')
    .then(function (response) {
        
        let data = response.data.filter(element => element.user == user);
        lenght =  data.length;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
}


getFavLength();

const addFav = bookid => {
    getFavLength();
    
    //     axios.post('https://us-central1-elib-bb434.cloudfunctions.net/app/fav/api/create', {
    
    // })
    // lenght += 1;
    db.collection("fav").add({
        bookid: bookid,
        user: email
    })
    .then(function (response) {
        alert("Berhasil menambahkan buku!");
        console.log(bookid);
        
    })
    .catch(function (error) {
        alert("Gagal menambahkan buku! Coba sesaat lagi");
        console.log(error);
    });
}

//setup materialize
document.addEventListener('DOMContentLoaded', function(){
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
});

// id: lenght,
//     bookid: bookid,
//     user: email


const setAcc = user => {
    db.collection("fav").where("user", "==", user)
    .get()
    .then(function(querySnapshot) {
        let count = 0;
        querySnapshot.forEach(function(doc) {
            count += 1;
        });

        let html = `
        <h6>${user}</h6>
        <p>Books Added : ${count}</p>`;
        
        document.querySelector('#account-detail').innerHTML = html;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

   
}