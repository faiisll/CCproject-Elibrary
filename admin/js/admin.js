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
                <button class="btn btn-sm btn-primary" onclick="editBook(${doc.data().id})">Edit</button>
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