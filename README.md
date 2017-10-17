**Getting Started**

Update the CLI to latest version

```bash
sudo npm install -g @angular/cli
```

Download the project source

```bash
git clone https://github.com/erikhaddad/firebrew.git
```

Change to parent directory

```bash
cd firebrew
```

Start dev server
```bash
ng serve --port 4200 --o
```

Browser should open to [http://localhost:4200](http://localhost:4200)


**Change environment variables src\environments\environments.ts AND src\environments\environments.prod.ts**

```javascript
export const environment = {
    ...,
    firebase: {
        apiKey: '<!-- YOUR KEY HERE -->',
        authDomain: '<!-- YOUR KEY HERE -->',
        databaseURL: '<!-- YOUR KEY HERE -->',
        projectId: '<!-- YOUR KEY HERE -->',
        storageBucket: '<!-- YOUR KEY HERE -->',
        messagingSenderId: '<!-- YOUR KEY HERE -->'
    }
};
```


**Run PWA build script and server**

```
./run.sh
```


**Deploy your app**

```
./deploy.sh
```