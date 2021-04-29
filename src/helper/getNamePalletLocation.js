export default function getNamePalletLocation(locationObj) {

    if(!locationObj) return '';

    let shelveSlugName = getShelveNameFromID(locationObj.shelve_id);

    return `${shelveSlugName}${locationObj.row} - ${locationObj.floor}`;
}

export const getShelveNameFromID = (sheleID) => {
    if(!sheleID) return '';

    return String.fromCharCode(64 + Number(sheleID));
}