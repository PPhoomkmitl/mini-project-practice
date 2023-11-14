function getTimeSincePosted(timeStamp) {
    const currentDate = new Date();
    const timeUnits = [
      { label: 'ปี', duration: 1000 * 60 * 60 * 24 * 365 },
      { label: 'เดือน', duration: 1000 * 60 * 60 * 24 * 30 },
      { label: 'วัน', duration: 1000 * 60 * 60 * 24 },
      { label: 'ชั่วโมง', duration: 1000 * 60 * 60 },
      { label: 'นาที', duration: 1000 * 60 },
      { label: 'วินาที', duration: 1000 }
    ];
  
    const timeStampDate = new Date(timeStamp);
    let timeDifference = currentDate - timeStampDate;
    let timeString = '';
  
    for (const unit of timeUnits) {
      const unitValue = Math.floor(timeDifference / unit.duration);
      if (unitValue > 0) {
        timeString = `${unitValue} ${unit.label}`;
        break;
      }
    }
  
    return timeString || 'เพิ่งโพสต์เมื่อนี้';
  }
  
  export default getTimeSincePosted;
  