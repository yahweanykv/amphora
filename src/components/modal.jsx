import React, { useState } from 'react';
import './modal.css';

const Modal = ({ isOpen, onClose, onAddItem }) => {
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddItem({ name: itemName, price: itemPrice });
        setItemName('');
        setItemPrice('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Add your new wish</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>What is it?:</label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit">Add</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;