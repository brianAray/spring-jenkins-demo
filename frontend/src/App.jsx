import { useState, useEffect } from 'react'

function App() {
    const [items, setItems] = useState([])
    const [newItem, setNewItem] = useState('')

    // Replace with actual Backend URL from EC2
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/items';

    useEffect(() => {
        fetchItems();
    }, [])

    const fetchItems = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error('Error fetching items:', err));
    }

    const addItem = () => {
        if (!newItem) return;
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newItem })
        })
            .then(res => res.json())
            .then(item => {
                setItems([...items, item]);
                setNewItem('');
            })
            .catch(err => console.error('Error adding item:', err));
    }

    return (
        <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem' }}>
            <h1>Jenkins CI/CD Demo</h1>
            <p>Deployed via Jenkins Pipeline to AWS S3 & EC2</p>

            <div style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Items from Postgres DB</h2>

                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="New Item Name"
                        style={{ padding: '0.5rem', marginRight: '0.5rem' }}
                    />
                    <button onClick={addItem} style={{ padding: '0.5rem 1rem' }}>Add Item</button>
                </div>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {items.map(item => (
                        <li key={item.id} style={{ padding: '0.5rem', background: '#f5f5f5', margin: '0.5rem 0' }}>
                            {item.id}: {item.name}
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default App
