export interface Education {
  
    educationRows: educationRow[];
}

export interface educationRow {
    institutionName:string;
    locationName:string;
    degree: string;
    specialization: string;
    month:string,
    percentage:Number;
}