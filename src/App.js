import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('dashboard');

  // sample seeded data
  const [encounters, setEncounters] = useState([
    { id: 1, date: '2025-01-15', age: 8, sex: 'F', diagnosis: 'Malaria', meds: 'Artemether-Lumefantrine', tests: 'RDT' },
    { id: 2, date: '2025-01-16', age: 32, sex: 'M', diagnosis: 'URTI', meds: 'Amoxicillin', tests: '' },
    { id: 3, date: '2025-01-20', age: 3, sex: 'F', diagnosis: 'Malaria', meds: 'Artemether-Lumefantrine', tests: 'RDT' }
  ]);

  const [form, setForm] = useState({ date: '', age: '', sex: 'M', diagnosis: '', meds: '', tests: '' });

  function saveEncounter(e) {
    e.preventDefault();
    const next = { ...form, id: encounters.length + 1 };
    setEncounters([next, ...encounters]);
    setForm({ date: '', age: '', sex: 'M', diagnosis: '', meds: '', tests: '' });
    setView('dashboard');
  }

  // analytics helpers
  function topConditions() {
    const counts = {};
    encounters.forEach(c => { counts[c.diagnosis] = (counts[c.diagnosis] || 0) + 1; });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  }

  function medsFrequency() {
    const counts = {};
    encounters.forEach(c => { if(c.meds){ counts[c.meds] = (counts[c.meds] || 0) + 1; }});
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  }

  function ageBands() {
    const bands = { '<1':0,'1-4':0,'5-14':0,'15-24':0,'25-49':0,'50+':0 };
    encounters.forEach(c => {
      const age = Number(c.age);
      if (isNaN(age)) return;
      if (age < 1) bands['<1']++;
      else if (age <=4) bands['1-4']++;
      else if (age <=14) bands['5-14']++;
      else if (age <=24) bands['15-24']++;
      else if (age <=49) bands['25-49']++;
      else bands['50+']++;
    });
    return Object.entries(bands);
  }

  return (
    <div style={{fontFamily:'Inter, system-ui, sans-serif', padding:20, background:'#f3f4f6', minHeight:'100vh'}}>
      <header style={{textAlign:'center', marginBottom:20}}>
        <h1 style={{margin:0}}>HealthStat Hub — Prototype</h1>
        <small style={{color:'#6b7280'}}>Simple in-browser prototype with seeded data</small>
      </header>

      <nav style={{display:'flex', gap:8, justifyContent:'center', marginBottom:20}}>
        <button onClick={()=>setView('dashboard')}>Dashboard</button>
        <button onClick={()=>setView('new')}>New Encounter</button>
        <button onClick={()=>setView('list')}>Encounters</button>
      </nav>

      <main style={{maxWidth:980, margin:'0 auto'}}>
        {view === 'dashboard' && (
          <section>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16}}>
              <div style={{background:'#fff', padding:16, borderRadius:12}}>
                <div style={{fontSize:12, color:'#6b7280'}}>Total Visits</div>
                <div style={{fontSize:28, fontWeight:700}}>{encounters.length}</div>
              </div>
              <div style={{background:'#fff', padding:16, borderRadius:12}}>
                <div style={{fontSize:12, color:'#6b7280'}}>Top Condition</div>
                <div style={{fontSize:20, fontWeight:700}}>{topConditions()[0] ? topConditions()[0][0] : '-'}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>{topConditions()[0] ? `${topConditions()[0][1]} cases` : ''}</div>
              </div>
              <div style={{background:'#fff', padding:16, borderRadius:12}}>
                <div style={{fontSize:12, color:'#6b7280'}}>Top Medication</div>
                <div style={{fontSize:20, fontWeight:700}}>{medsFrequency()[0] ? medsFrequency()[0][0] : '-'}</div>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12}}>
              <div style={{background:'#fff', padding:16, borderRadius:12}}>
                <h3 style={{marginTop:0}}>Top Conditions</h3>
                <ol>
                  {topConditions().slice(0,10).map(([cond,count])=> (
                    <li key={cond}>{cond} — {count}</li>
                  ))}
                </ol>
              </div>

              <div style={{background:'#fff', padding:16, borderRadius:12}}>
                <h3 style={{marginTop:0}}>Age Bands</h3>
                <ul>
                  {ageBands().map(([band,count])=> (
                    <li key={band}>{band}: {count}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {view === 'new' && (
          <section style={{background:'#fff', padding:16, borderRadius:12}}>
            <h3 style={{marginTop:0}}>New Encounter</h3>
            <form onSubmit={saveEncounter} style={{display:'grid', gap:8}}>
              <input required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="Date (YYYY-MM-DD)" />
              <input required value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="Age (years)" />
              <select value={form.sex} onChange={e=>setForm({...form,sex:e.target.value})}>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              <input required value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})} placeholder="Diagnosis" />
              <input value={form.meds} onChange={e=>setForm({...form,meds:e.target.value})} placeholder="Medications (comma separated)" />
              <input value={form.tests} onChange={e=>setForm({...form,tests:e.target.value})} placeholder="Tests ordered" />
              <div style={{display:'flex', gap:8}}>
                <button type="submit">Save Encounter</button>
                <button type="button" onClick={()=>setForm({date:'',age:'',sex:'M',diagnosis:'',meds:'',tests:''})}>Clear</button>
              </div>
            </form>
          </section>
        )}

        {view === 'list' && (
          <section style={{background:'#fff', padding:16, borderRadius:12}}>
            <h3 style={{marginTop:0}}>Encounters</h3>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead style={{textAlign:'left'}}>
                <tr>
                  <th>Date</th><th>Age</th><th>Sex</th><th>Diagnosis</th><th>Meds</th><th>Tests</th>
                </tr>
              </thead>
              <tbody>
                {encounters.map(r=> (
                  <tr key={r.id} style={{borderTop:'1px solid #e5e7eb'}}>
                    <td>{r.date}</td>
                    <td>{r.age}</td>
                    <td>{r.sex}</td>
                    <td>{r.diagnosis}</td>
                    <td>{r.meds}</td>
                    <td>{r.tests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </main>

      <footer style={{textAlign:'center', marginTop:24, color:'#6b7280'}}>
        Prototype • Data in browser memory only • Use "New Encounter" to add sample rows
      </footer>
    </div>
  );
}

/*
CSV import template (copy into a CSV file):
date,age,sex,diagnosis,meds,tests
2025-01-15,8,F,Malaria,"Artemether-Lumefantrine","RDT"

How to run this prototype locally:
1. Create a new React app using create-react-app:
   npx create-react-app healthstat-proto
2. Replace src/App.js with this file's contents.
3. npm start

This prototype stores data in browser memory (React state). It's intended to demonstrate
flows and analytics; next step is to connect it to the Django API so data is persistent and multi-user.
*/
