import React from 'react'

function OptionCard({ title, icon, onClick }) {
    return (
        <div onClick={onClick} className="space-y-2 cursor-pointer hover:scale-105 transition-transform mb-6">
            <p className="text-gray-600 font-medium text-center">{title}</p>
            <div className="bg-indigo-100 rounded-2xl aspect-square flex justify-center items-center shadow-md">{icon}</div>
        </div>
    )
}

export default OptionCard