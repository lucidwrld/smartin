"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const ProgramContext = createContext()

export const ProgramProvider = ({ children }) => {
    const [selectedProgram, setSelectedProgram] = useState(null)
    const [selectedTickets, setSelectedTickets] = useState(null)
    const [selectedEventId, setSelectedEventId] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from session storage on mount
    useEffect(() => {
        const program = (sessionStorage.getItem('selectedProgram')) 
        const tickets = (sessionStorage.getItem('selectedTickets')) 
        const eventId = (sessionStorage.getItem('selectedEventId')) 
        if (program) {
            setSelectedProgram(JSON.parse(program))
        }
        if (tickets) {
            setSelectedTickets(JSON.parse(tickets))
        }
        if(eventId){
            setSelectedEventId(eventId)
        }
        setIsLoaded(true)
    }, [])

    // Save to session storage whenever selectedProgram changes
    useEffect(() => {
        if (isLoaded && selectedProgram) {
            sessionStorage.setItem('selectedProgram', JSON.stringify(selectedProgram))
        } else if (isLoaded && selectedProgram === null) {
            sessionStorage.removeItem('selectedProgram')
        }
    }, [selectedProgram, isLoaded])
    useEffect(() => {
        if (isLoaded && selectedTickets) {
            sessionStorage.setItem('selectedTickets', JSON.stringify(selectedTickets))
        } else if (isLoaded && selectedTickets === null) {
            sessionStorage.removeItem('selectedTickets')
        }
    }, [selectedTickets, isLoaded])
    useEffect(() => {
        if (isLoaded && selectedEventId) {
            sessionStorage.setItem('selectedEventId', selectedEventId)
        } else if (isLoaded && selectedEventId === null) {
            sessionStorage.removeItem('selectedEventId')
        }
    }, [selectedEventId, isLoaded])

    const clearSelectedProgram = () => {
        setSelectedProgram(null)
        sessionStorage.removeItem('selectedProgram')
    }
    const clearSelectedTickets = () => {
        setSelectedTickets(null)
        sessionStorage.removeItem('selectedTickets')
    }
    const clearSelectedEventId = () => {
        setSelectedEventId(null)
        sessionStorage.removeItem('selectedEventId')
    }
     
    return (
        <ProgramContext.Provider value={{ 
            selectedProgram, 
            setSelectedProgram,
            selectedEventId,
            setSelectedEventId,
            selectedTickets,
            setSelectedTickets,
            clearSelectedTickets,
            clearSelectedEventId,
            clearSelectedProgram,
            isLoaded 
        }}>
            {children}
        </ProgramContext.Provider>
    )
}

export const useProgram = () => {
    const context = useContext(ProgramContext)
    
    if (context === undefined) {
        throw new Error('useProgram must be used within a ProgramProvider')
    }
    
    return context
}