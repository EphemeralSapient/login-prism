import { useState, useEffect } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import logo from './logo.png';
import "./App.css";
import firebaseApp from "./firebase"
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, OAuthProvider, UserCredential, onAuthStateChanged   } from "firebase/auth";
import {
  AppleOutlined,
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormText,
} from '@ant-design/pro-components';
import {  Divider, Space, Tabs, message } from 'antd';

let hasAttached = false;
let isNew = true;

function App() {
  const [showBackground, setShowBackground] = useState(false);
  const [showCard, setCard] = useState(false);
  const [showBG, setBG] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);


  type LoginType = 'phone' | 'account';

  const [loginType, setLoginType] = useState<LoginType>('account');
  

  const loggedIn = async (credential: UserCredential) => {
    console.log(credential);
  }


  useEffect(() => {
    // Trigger the transition after a delay (e.g., 1 second)
    setTimeout(() => {
      setShowBackground(true);
      if(hasAttached == false) {
        hasAttached = true;
        try{
          let auth = getAuth(firebaseApp);
          onAuthStateChanged(auth,async (user) => {
            if (user) {
            // User is signed in
              if(isNew == true) {
                message.loading("Already logged in, redirecting...");
                await waitTime(1000);
              } else {
    
              }
              await waitTime(700);
              setIsAnimated(true);
            await waitTime(1250);
            // Redirect now
            window.location.href = window.location.href.replace(import.meta.env.BASE_URL, import.meta.env.VITE_DASHBOARD_URL);
              // ... Access user information
            } else {
              // User is signed out
              // ... Handle the situation as needed
            }
          });
        } catch(e) {message.error(String(e))}
      }
    }, 100);
  }, []);

  useEffect(() => {
    setTimeout(() => {
          setCard(true);  
          isNew = false;      
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setBG(true);
    }, 1500);
  }, []);


const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const generatePassword = (length: number) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};


  return (
    <div className={`full-size ${isAnimated ? 'move-left-slow' : ''}`} style={{position:"relative"}}>
    
      <div  className={`gradient-background${showBackground ? " show" : ""}`}>
        
        <div className={`card-container${showCard ? " show" : ""} ${isAnimated ? 'move-left' : ''}`} >

            <div className={`content${showBG ? " show" : ""}`} style={{position:"absolute", zIndex:2 }}>

            <div className="">
              
              
            <ProConfigProvider hashed={false} dark>


<LoginFormPage
      onFinish={async (values) => {
        // firebase.
        try{
          let auth = getAuth(firebaseApp);
          console.log(auth);
          if(values["name"] != null) {
            // signInAnonymously
            let credentials = await signInAnonymously(auth); 
            console.log(credentials);
            message.success(`Successfully logged-in as ${credentials.user.isAnonymous ? " Guest" : " domain user"}`)
            loggedIn(credentials);
          } else {
            // account sign in
            let credentials = await signInWithEmailAndPassword (auth, values["email"], values["password"]);
            message.success(`Successfully logged-in as ${credentials.user.isAnonymous ? " Guest" : " domain user"}`);
            loggedIn(credentials);

          }
        } catch (e) {
          if(String(e) == "FirebaseError: Firebase: Error (auth/user-not-found)."){
            if(import.meta.env["VITE_AUTHDOMAIN"] != undefined) {
              if(values["email"].endsWith(import.meta.env.VITE_AUTHDOMAIN) == false) {
                message.error("Given email address domain is not acceptable, use "+ import.meta.env.VITE_AUTHDOMAIN + " domain");
                return;
              }
            }
            try {
              let auth = getAuth(firebaseApp);
              await createUserWithEmailAndPassword(auth,values["email"],generatePassword(10));
              await sendPasswordResetEmail(auth,values["email"]);
              message.info("Please verify your account, check your email address", 10);
            } catch (ee) {
              message.error(String(ee));
            }
          } else if(String(e) == "FirebaseError: Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
            let auth = getAuth(firebaseApp);
            await sendPasswordResetEmail(auth,values["email"]);
            message.info("Access to this account is temporarily disabled, reset password link has been sent to your email address.", 10);

          } else {
            console.log(String(e));
            message.error(String(e));
          }
        } 
       
     }}

title="Project Prism"
containerStyle={{
backgroundColor: 'rgba(0, 0, 0,0)',
backdropFilter: 'blur(0px)',
transition:"width 1s ease"
}}
subTitle="Welcome! Enter your credentials to proceed"
activityConfig={
  {}
}
submitter={{
// Configure the button text
searchConfig: {
submitText: 'Login',
},

submitButtonProps: {},

}}
actions={
<div
style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}}
>
<Divider style={{
  
}}>
  <span
    style={{
      fontSize: 14,
    }}
  >
    Single sign-on
  </span>
</Divider>
<Space align="center" size={24}>
  <div
  className="ssoIcons"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: 40,
      width: 40,
      border: '1px solid ' + "black",
      borderRadius: '50%',
    }}
    onClick={ async () => {
      try {
        let auth = getAuth(firebaseApp);
        const provider = new GoogleAuthProvider();
        let credentials = await signInWithPopup(auth, provider)
        message.success(`Successfully logged-in as ${credentials.user.isAnonymous ? " Guest" : " domain user"}`)
        loggedIn(credentials);
      } catch(e) {
        message.error(String(e));
      }
    }}
  >
    <GoogleOutlined  style={{ }} />
  </div>
  <div
    className="ssoIcons"

    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: 40,
      width: 40,
      border: '1px solid ' + "black",
      borderRadius: '50%',
    }}
    onClick={() => {
      message.info("Github OAuth 2.0, will be implemented soon.");

      try {
        let auth = getAuth(firebaseApp);
      } catch(e) {
        message.error(String(e));
      }
    }}
  >
    <GithubOutlined style={{  }} />
  </div>
  <div
    className="ssoIcons"

    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: 40,
      width: 40,
      border: '1px solid ' + "black",
      borderRadius: '50%',
    }}
    onClick={() => {
      message.info("Apple OAuth 2.0, will be implemented soon.");

      try {
        let auth = getAuth(firebaseApp);
      } catch(e) {
        message.error(String(e));
      }
    }}
  >
    <AppleOutlined style={{  }} />
  </div>
</Space>
</div>
}
>
<Tabs
centered

activeKey={loginType}
onChange={(activeKey) => setLoginType(activeKey as LoginType)}
>
<Tabs.TabPane key={'account'} tab={'Account'}  />
<Tabs.TabPane key={'phone'} tab={'Guest Portal'} />
</Tabs>
{loginType === 'account' && (
<>
<ProFormText
  name="email"
  fieldProps={{
    size: 'large',
    prefix: (
      <MailOutlined
        style={{
          color: "grey",
        }}
        className={'prefixIcon'}
      />
    ),
  }}
  placeholder={'Email Address'}
  rules={[
    {
      type:"email",
      
      required: true,
      message: 'Please enter valid email address of your domain',
    },
  ]}
/>
<ProFormText.Password
  name="password"
  fieldProps={{
    size: 'large',
    prefix: (
      <LockOutlined
        style={{
          color: "grey",
        }}
        className={'prefixIcon'}
      />
    ),
  }}
  placeholder={'Password'}
  rules={[
    {
      required: true,
      message: 'Password is required',
    },
  ]}
/>
</>
)}
{loginType === 'phone' && (
<>
<ProFormText
  fieldProps={{
    size: 'large',
    prefix: (
      <UserOutlined
        style={{
          color: "grey",
        }}
        className={'prefixIcon'}
      />
    ),
  }}
  name="name"
  placeholder={'Name'}
  rules={[
    {
      required: true,
      message: 'Please fill the field',
    }

  ]}
/>

</>
)}
<div
style={{
marginBlockEnd: 24,
}}
>
</div>
</LoginFormPage>


</ProConfigProvider>
            </div>


  
            </div>

            <div style={{zIndex: 1}} className={`card${showCard ? " show" : ""}`}>
            

              {/* <ProgressIndicator label="Example title" description="Example description" /> */}
              <img className={`img${showBG ? " show" : ""}`} src={logo}  style={{ position: "relative", width: 'auto', height: '100%' }}></img>
            </div>
         
        </div>
      
      
        {/* <img className="full-size" style={{width:"auto", opacity:0.5, position:"absolute" , height: "100vh", zIndex: 0}} src="https://pixabay.com/get/gdf1d8f2f43d6bb46dc5792de092dcd7825ffd6707a2e7900d2dd613dfaaa2b6d65862614f26dcb01913c68339ce09887.jpg"/> */}
      </div>
    </div>
  );
}

// function Appp() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App;
