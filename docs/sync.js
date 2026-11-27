import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {getFirestore,doc,onSnapshot,setDoc,getDoc} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const app=initializeApp({"apiKey":"AIzaSyADkPAgP_8F1XOBfcPwPgo_sybLSATuhKA","projectId":"bookshelf-70413","appId":"1:1072415265799:web:155ea5388ee494899ac6a2","authDomain":"bookshelf-70413.firebaseapp.com"}),auth=getAuth(app),db=getFirestore(app);
const syncButton=document.querySelector('#sync-order');let unsubscribe;
syncButton.onclick=async()=>{try{if(auth.currentUser)await signOut(auth);else await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){alert('Sign-in failed: '+e.message)}};
onAuthStateChanged(auth,async user=>{
 unsubscribe?.();saveRemote=undefined;
 syncButton.textContent=user?'Sign out of order sync':'Sign in to sync order';
 if(!user)return;
 const ref=doc(db,'shelfOrders',user.uid);
 try{
 const first=await getDoc(ref);if(auth.currentUser?.uid!==user.uid)return;
 if(!first.exists())await setDoc(ref,{ids:order});
 if(auth.currentUser?.uid!==user.uid)return;
 saveRemote=ids=>setDoc(ref,{ids});
 unsubscribe=onSnapshot(ref,snap=>{const ids=snap.data()?.ids;if(Array.isArray(ids)){setOrder(ids);if(view==='collection')render()}},()=>notify('Could not sync shelf order.'));
 }catch(e){notify('Order sync unavailable. Check Firebase settings and rules.')}
});