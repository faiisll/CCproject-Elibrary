

//listen for auth status changes
let email = "";

auth.onAuthStateChanged(user =>{
    
    if(user){
        //get data
        db.collection('fav').onSnapshot( snapshot => {
            //console.log(user.email);
            getBook(1);
            setupUI(user);
            email = user.email;
            getFav2(email);
            setAcc(email);
        });
    }else{
        length = 0;
        getBook(0);
        setupGuides([]);
        setupUI();
        lenght =  0;
    }
});

//create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', e => {
    e.preventDefault();
    
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then( () => {
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    });
})


//sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    
    //sign uo the user
    auth.createUserWithEmailAndPassword(email, password)
    .then( cred => {
        console.log(cred);
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    
    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    
    auth.signInWithEmailAndPassword(email, password).then( cred => {
        
    });
    
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
});

const removeFav = (id, user) =>{
    let query = db.collection('fav').where("user", "==", user).where('bookid','==', id);
    query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
        alert("Berhasil menghapus buku!");
    }).catch( err => {
        alert("Gagal menghapus buku, coba beberapa saat lagi");
    });
}