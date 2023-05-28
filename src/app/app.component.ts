import {
  Component
} from '@angular/core';
import {
  Goal
} from './goal.model';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  DocumentReference,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import {
  Observable,
  Subscription
} from 'rxjs';
import {
  deleteDoc
} from 'firebase/firestore';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user
} from '@angular/fire/auth';
import {
  User
} from './user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Git-Er-Dun';
  titleText = "";
  detailsText = "";
  deadlineText = "";
  goalsCollection: any;
  user$ = user(this.auth);
  userSubscription: Subscription;
  currentUser: any;

  goals: Observable < Goal[] > ;
  constructor(firestore: Firestore, private auth: Auth, private modalService: NgbModal) {
    this.goalsCollection = collection(firestore, 'goals');
    this.goals = collectionData(this.goalsCollection, {
      idField: "id"
    }) as Observable < Goal[] > ;

    this.userSubscription = this.user$.subscribe((aUser: any) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      this.currentUser = aUser;
      console.log(this.currentUser);
    })
  }

  clickedAddButton() {
    this.modalService.dismissAll();
    addDoc(this.goalsCollection, < Goal > {
      userId: this.currentUser.uid,
      title: this.titleText,
      details: this.detailsText,
      deadline: this.deadlineText,
      isComplete: false
    }).then((documentReference: DocumentReference) => {
      console.log(documentReference);
      this.titleText = "";
      this.deadlineText = "";
      this.detailsText = "";
      // the documentReference provides access to the newly created document
    });
  }

  deleteGoal(goal: any) {
    let docDocGoose = doc(this.goalsCollection, goal.id);
    deleteDoc(docDocGoose);
  }

  completedButton(goal: any) {
    let docDocGeese = doc(this.goalsCollection, goal.id);
    updateDoc(docDocGeese, {
      isComplete: !goal.isComplete
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  async logout() {
    return await signOut(this.auth);
  }

  open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
			},
			(reason) => {
			},
		);
	}
}
