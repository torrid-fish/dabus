import { createContext, useEffect, useContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Firebase Initialization //
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAul7mwI4BoZVSw5BdDYyo7o5FOGJxMm2A",
  authDomain: "dabus-d0bb3.firebaseapp.com",
  databaseURL: "https://dabus-d0bb3-default-rtdb.firebaseio.com",
  projectId: "dabus-d0bb3",
  storageBucket: "dabus-d0bb3.appspot.com",
  messagingSenderId: "1050889385758",
  appId: "1:1050889385758:web:6cab81cf8b78c7429d7b0f",
  measurementId: "G-K5Q4PMNELZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
var uid;

const DataContext = createContext(null);

const DataDispatchContext = createContext(null);

export function DataProvider({ children }) {
  const [data, dispatch] = useReducer(
    dataReducer,
    initialData
  );

  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <DataContext.Provider value={data}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
}

async function fetchData() {
  const dispatch = useDataDispatch();
  dispatch({
    type: 'setLoading', 
    value: true
  });
  const localData = (async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem("data"));
      dispatch({
        type: 'overwrite', 
        value: data
      });
      return data;
    } catch (error) {
      console.log(error);
      console.log('🤯');
      await AsyncStorage.setItem("data", JSON.stringify(initialData)); 
      return initialData; 
    }
  })(); // don't remove the ()
  if (localData.loggedIn) {
    const uuid = localData.uuid;
    try {
      const dbData = await getDataFromDB(uuid);
      dispatch({
        type: 'overwrite', 
        data: dbData
      }); 
      dispatch({
        type: 'setLoading', 
        value: false
      });
    } 
    catch (err) {
      console.error('Error getting data from db', err);
      dispatch({
        type: 'setLoading', 
        value: false
      });
    }
  }
} 

function writeDataToDB(uid, data) {
  const reference = ref(database, 'users/' + uid);
  try{
    set(reference, data);
    console.log('Successfully write data to DB.');
  }
  catch (err) {
    console.log('Failed to write data to DB.', err);
  }
}

async function getDataFromDB(uid) {
  const reference = ref(database, 'users/' + uid);
  try {
    const snapshot = await new Promise((resolve, reject) => {
      onValue(reference, (snapshot) => {
        resolve(snapshot);
      }, (error) => {
        reject(error);
      });
    });

    const data = snapshot.val();
    console.log('Successfully read data from DB.');
    return data;
  } catch (error) {
    console.log('Failed to read data from DB.', error);
    throw error;
  }
}

function SignIn(email, password) {
  return new Promise ((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((creadential) => {
        console.log('Logged in successfully.');
        resolve(creadential.user.uid);
      })
      .catch((err) => {
        console.log('Failed to log in,', err);
        reject('Failed to log in,', err);
        
      })
  })
}

function SignOut() {
  return new Promise((resolve, reject) => {
    signOut(auth).then(() => {
      resolve('Signed out successfully.')
    }).catch((err) => {
      reject('Failed to signed out.', err);
    });
  })
}

function createAccount(email, password) {
  return new Promise ((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((creadential) => {
        console.log('Created successfully!');
        resolve(creadential.user.uid);
      })
      .catch((err) => {
        reject('Failed to create account', err);
      })
  })
}

export function useData() {
  return useContext(DataContext);
}

export function useDataDispatch() {
  return useContext(DataDispatchContext);
}

function dataReducer(data, action) {
  switch (action.type) {
    case 'overwrite': {
      return action.data;
    }
    case 'toggleTheme': {
      return {...data, settings: {
        ...data.settings,
        theme: data.settings.theme === 'dark' ? 'light' : 'dark'
      }};
    }
    case 'setLanguage': {
      return {...data, settings: {
        ...data.settings,
        language: action.language
      }};
    }
    case 'setColor': {
      return {...data, settings: {
        ...data.settings,
        color: action.color
      }};
    }
    case 'addTreePercents':{
      if (data.treePercents + action.treePercents > 100) {
        const newColor = data.colors.find(c => c.unlocked === false);
        if (newColor) 
          return {
            ...data,
            showFruit: true,
            newColor: newColor.color,
            colors: data.colors.map(c => {
              if (c.color === newColor.color)  
                return {
                  ...c,
                  unlocked: true
                }
              else 
                return c;
            })
          }
        else {
          console.log('Not enough colors!');
          return data;
        }
      }
      else{
        return {
          ...data,
          treePercents: data.treePercents + action.treePercents
        }
      }
    }
    case 'addFavorite':{
      return {
        ...data, 
        favorite : [
          ...data.favorite,
          action.name
        ]
      };
     
    }
    case 'removeFavorite':{
      return {
        ...data, 
        favorite: data.favorite.filter(fav =>
          fav !== action.name
        )
      };
    }
    case 'addReminder':{
      return {
        ...data, 
        reminder :[
          ...data.reminder,
          {
            ...action.reminder,
            id: nextid++
          }
        ]
        
      };
    }
    case 'removeReminder':{
      return {
        ...data,
        reminder: data.reminder.filter(rem => 
          rem.id !== action.id
        )
      };
    }
    case 'setReminderHour':{
      return {
        ...data, 
        reminder: data.reminder.map(rem => {
            if (rem.id === action.id)
              return {...rem, hour: action.hour}
            else 
              return rem
          }
        )
      };
    }
    case 'setReminderMinute':{
      return {
        ...data, 
        reminder: data.reminder.map(rem => {
          if (rem.id === action.id)
            return {...rem, minute: action.minute}
          else 
            return rem
        }
      )
      };
    }
    case 'toggleReminderRepeatDay':{
      console.log('Toggling ', action.day);
      return {
        ...data, 
        reminder: data.reminder.map(rem => {
            if (rem.id === action.id) {
              return {
                ...rem,
                repeat: rem.repeat.map(rep => {
                  if (rep.day === action.day)
                    return {
                      ...rep,
                      on: !rep.on
                    }
                  else 
                    return rep;
                })
              }
            }
            else 
              return rem;
          }
        )
      };
    }
    case 'setReminderBeforeTime':{
      return {
        ...data, 
        reminder: data.reminder.map(rem => {
            if (rem.id === action.id)
              return {...rem, remind: action.remind}
            else 
              return rem
          }
        )
      };
    }
    case 'setReminderType':{
      return {
        ...data, 
        reminder: data.reminder.map(rem => {
            if (rem.id === action.id)
              return {...rem, type: action.type};
            else 
              return rem;
          }
        )
      };
    }
    case 'hideFruit': {
      return {
        ...data,
        showFruit: false,
        treePercents: 0
      }
    }
    case 'login':{
      // 期待呼叫這個reducer的action裡面有uuid(只是用來更新下面的uuid)
      // (無論他之前有沒有登入過，如果沒有的話，我們)
      return {
        ...data,
        uuid: action.uuid,
        loggedIn: true,
      }
    }
    case 'setLoading': {
      return {
        ...data,
        loading: action.loading
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextid = 1;

const initialData = {
  loggedIn: false,
  uuid: null,
  loading: true,
  settings: {theme: 'light', language: 'english', color: '#07B'},
  favorite: [
    'stop 1',
    'stop 2',
    'stop 3',
    'stop 4',
  ],
  recentlySearched: [
    'stop 1',
    'stop 6',
    'stop 8',
    'stop 99'
  ],
  reminder: [
    {
      id : 0,
      bus: 'Bus1',
      from: 'Here',
      to: 'There',
      repeat: [
        {day: 0, on: false},
        {day: 1, on: false},
        {day: 2, on: true},
        {day: 3, on: false},
        {day: 4, on: false},
        {day: 5, on: true},
        {day: 6, on: false},
      ],
      hour: 18,
      minute: 30,
      remind: 10
    },
    {
      id : 1,
      bus: 'Bus3',
      from: 'Here',
      to: 'There',
      repeat: [
        {day: 0, on: false},
        {day: 1, on: false},
        {day: 2, on: false},
        {day: 3, on: false},
        {day: 4, on: false},
        {day: 5, on: false},
        {day: 6, on: false},
      ],
      hour: 18,
      minute: 30,
      remind: 10
    },
  ],
  treePercents: 40,
  showFruit: false,
  newColor: null,
  colors: [
    {color: '#07B', unlocked: true},
    {color: '#D83', unlocked: false},
    {color: '#56B', unlocked: false},
    {color: '#39B', unlocked: false},
    {color: '#969', unlocked: false},
  ],
};