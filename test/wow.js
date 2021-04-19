const shouldDisplay = value => {
    return (value && (value.length) ) || value===0 || value===false ? formatValue(value) : notSet()
    if(Array.isArray(value) && !value.length){
      return notSet();
    }

    if(typeof value === 'string' && !value.length){
      return notSet();
    }

    if(value === 0){
      return formatValue(value);
    }
    
    if(value === false){
      return formatValue(value);
    }

    if(value){
      formatValue(value);
    }
    else{
      return notSet();
    } 
  }
