import { createContext, useContext, useReducer } from 'react';

const DataContext = createContext(null);

const DataDispatchContext = createContext(null);

export function DataProvider({ children }) {
  const [data, dispatch] = useReducer(
    dataReducer,
    initialData
  );

  return (
    <DataContext.Provider value={data}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

export function useDataDispatch() {
  return useContext(DataDispatchContext);
}

function dataReducer(data, action) {
  switch (action.type) {
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
      if (data.treePercents + action.treePercents >= 100) {
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
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextid = 1;

const initialData = {
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
  ],
};