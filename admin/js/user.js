const table = document.querySelector('#tbl-user');

const getFav = () => {
    db.collection("books").get().then(function(querySnapshot) {
        let html = '';
        let books = [];
        let count = 1;
        querySnapshot.forEach(function(doc) {
            books.push(doc.data());
        });
        
        db.collection("fav").get().then(function(qs) {
            let fav = [];
            qs.forEach(function(dc) {
                fav.push(dc.data());
            });
            
            const result = Array.from(new Set(fav.map( s => s.bookid)))
            .map( bookid => {
                return {
                    bookid: bookid,
                    user: fav.find(s => s.bookid === bookid).user
                };
            });
            console.log(result);
            
            fav.forEach(data => {
                html += `
                <tr>
                    <td>${count}</td>
                    <td>${data.user}</td>
                    <td>${books[data.bookid].title}</td>
                </tr>
                `;
                count ++;
            });
            
            table.innerHTML = html;
            
        });
        
    });
}

getFav();
