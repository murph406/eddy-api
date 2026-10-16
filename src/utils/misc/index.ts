
export const convertTo24hr = (timeString: string) => {
    const [time, modifier] = timeString.split(' ')
    const minutes = time.split(':')[1]
    let hours = time.split(':')[0]
    
    if (hours === '12') hours = '00'
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12)
    return `${String(hours).padStart(2, '0')}:${minutes}:00`
    
}

export const isValidDate = (date: Date) => !isNaN(date.getTime())