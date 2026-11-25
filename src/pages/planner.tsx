import { useEffect, useState } from 'react'
import SiteLayout from '../components/SiteLayout'

const storageKey = 'nartstudio-campaign-planner-v1'
const initialItems = ['Write the one-sentence promise', 'Choose the primary audience', 'Gather approved images and story assets', 'Outline the campaign page', 'Decide on an honest update rhythm', 'Confirm fulfillment and support details']
type Plan = { title: string; items: boolean[] }
const emptyPlan: Plan = { title: '', items: initialItems.map(() => false) }

function isStoredPlan(value: unknown): value is Plan {
  return typeof value === 'object'
    && value !== null
    && 'title' in value
    && typeof value.title === 'string'
    && 'items' in value
    && Array.isArray(value.items)
    && value.items.every(item => typeof item === 'boolean')
}

export default function Planner() {
  const [plan, setPlan] = useState<Plan>(emptyPlan)
  const [ready, setReady] = useState(false)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [storageMessage, setStorageMessage] = useState('Loading your local plan…')
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        if (!isStoredPlan(parsed)) {
          throw new Error('Saved launch plan has an unexpected format.')
        }
        setPlan({ title: parsed.title, items: initialItems.map((_, index) => parsed.items[index] === true) })
      }
    } catch (error) {
      console.error('Could not restore the local campaign plan:', error)
      setStorageAvailable(false)
      setStorageMessage('Local storage is unavailable or the saved plan could not be read. You can still use this checklist until you leave the page.')
    }
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready || !storageAvailable) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(plan))
      setStorageMessage('Auto-saved locally in this browser.')
    } catch (error) {
      console.error('Could not save the local campaign plan:', error)
      setStorageAvailable(false)
      setStorageMessage('The browser could not save this plan. Keep this page open or contact the studio for a launch conversation.')
    }
  }, [plan, ready, storageAvailable])
  const toggle = (index: number) => setPlan(current => ({ ...current, items: current.items.map((checked, i) => i === index ? !checked : checked) }))
  const done = plan.items.filter(Boolean).length
  const clear = () => {
    setPlan(emptyPlan)
    if (!storageAvailable) return
    try {
      localStorage.removeItem(storageKey)
      setStorageMessage('The local plan was cleared.')
    } catch (error) {
      console.error('Could not clear the local campaign plan:', error)
      setStorageAvailable(false)
      setStorageMessage('The browser could not clear the saved plan. Clear this site’s browser data to remove it.')
    }
  }
  return <SiteLayout title="Your launch planner"><main className="subpage planner-page"><div className="sub-hero"><p className="eyebrow"><i /> WORKSPACE / SAVED ON THIS DEVICE</p><h1>Small steps.<br /><em>Real momentum.</em></h1><p className="lede">A private, practical launch checklist. Your plan stays in this browser; it is not uploaded or shared.</p></div><section className="planner-board"><div className="planner-head"><div><span className="section-label">YOUR WORKING TITLE</span><label className="visually-hidden" htmlFor="plan-title">Working title</label><input id="plan-title" value={plan.title} onChange={e => setPlan({ ...plan, title: e.target.value })} placeholder="Give this launch a name…" maxLength={100} /></div><div className="progress-count"><strong>{done.toString().padStart(2, '0')}<small> / {initialItems.length.toString().padStart(2, '0')}</small></strong><span>STEPS COMPLETE</span></div></div><div className="progress-track" role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={initialItems.length} aria-valuenow={done}><span style={{ width: `${done / initialItems.length * 100}%` }} /></div><div className="checklist">{initialItems.map((item, index) => <label className={`check-row ${plan.items[index] ? 'is-checked' : ''}`} key={item}><input type="checkbox" checked={plan.items[index]} onChange={() => toggle(index)} /><span className="custom-check" aria-hidden="true">{plan.items[index] ? '✓' : ''}</span><span><b>{String(index + 1).padStart(2, '0')}</b>{item}</span></label>)}</div><div className="planner-footer"><span role="status" aria-live="polite">{storageMessage}</span><button className="quiet-button" type="button" onClick={clear}>Clear this plan</button></div></section><section className="planner-help"><div><div className="section-label">NEED A HUMAN?</div><h2>Want to talk<br /><em>through the idea?</em></h2><p>Email opens your mail app. Nothing is submitted or stored by this page.</p></div><a className="button button-outline" href="mailto:hello@nartstudio.com?subject=Campaign%20launch%20enquiry">Email Nartstudio ↗</a></section></main></SiteLayout>
}
