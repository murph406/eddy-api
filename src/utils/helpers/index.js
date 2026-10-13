
export const convertTo24hr = (timeString) => {
    const [time, modifier] = timeString.split(' ')
    let [hours, minutes] = time.split(':')
    
    if (hours === '12') hours = '00'
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12
    return `${String(hours).padStart(2, '0')}:${minutes}:00`
    
}

export const isValidDate = (date) => date instanceof Date && !isNaN(date)