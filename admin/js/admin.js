let count = 0;
const bookscon = document.querySelector('#book-container');
const getBook = () => {
    db.collection("books").get().then(function(querySnapshot) {
        let html = '';
        count = 0;
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            
            html += `
            <tr>
            <td>${count+1}</td>
            <td>${doc.data().title}</td>
            <td>${doc.data().description.slice(0, 100)}</td>
            <td>${doc.data().category}</td>
            <td>${doc.data().img}</td>
            <td>${doc.data().pdf}</td>
            <td>
            <button class="btn btn-sm btn-primary" onclick="editBook(${doc.id})">Edit</button>
            </td>
            </tr>
            `;
            
            count ++;
        });
        bookscon.innerHTML = html;
    });
}



const formAdd = document.querySelector('#form-add');
formAdd.addEventListener('submit', (e) => {
    e.preventDefault();
    
    db.collection("books").doc(`${count}`).set({
        title: formAdd['title'].value,
        description: formAdd['desc'].value,
        category: formAdd['category'].value,
        img: formAdd['img'].value,
        pdf: formAdd['pdf'].value
    })
    .then(function(docRef) {
        formAdd.reset();
        alert('Data Berhasil Di tambah');
        
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});

db.collection('books').onSnapshot( snapshot => {
    getBook();
});

const formEdit = document.querySelector('#form-edit');
formEdit.addEventListener('reset', () => changeForm(0));
formEdit.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection("books").doc(`${formEdit['id'].value}`).update({
        title: formEdit['title'].value,
        description: formEdit['desc'].value,
        category: formEdit['category'].value,
        img: formEdit['img'].value,
        pdf: formEdit['pdf'].value
    }).then((d) => {
        alert('Success Update data!');
        formEdit.reset();
        changeForm(0);
    });
});

const editBook = id => {
    changeForm(1);
    db.collection("books").doc(`${id}`)
    .get()
    .then(function(doc) {
        if (doc.exists) {
            formEdit['id'].value = doc.id;
            formEdit['title'].value = doc.data().title;
            formEdit['desc'].value = doc.data().description;
            formEdit['category'].value = doc.data().category;
            formEdit['img'].value = doc.data().img;
            formEdit['pdf'].value = doc.data().pdf;
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
};

const changeForm = stat => {
    if(stat == 1){
        formAdd.style.display = "none";
        formEdit.style.display = "block";
    }else{
        formAdd.style.display = "block";
        formEdit.style.display = "none";
    }
}