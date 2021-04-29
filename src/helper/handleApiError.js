import { dialog } from 'app/components/DialogNotify';

export default function handleApiError(err, form, defaultDialogMessage) {

    const errObj = findNestedObj(err.response, 'errors').errors;
    let errorsObj = {};
    const messageErr = findNestedObj(err.response, 'message')?.message;

    if (errObj) {
        Object.entries(errObj).forEach(
            ([kErr, vErr]) => {
                if(kErr === 'message') kErr = 'api';
                errorsObj[kErr] = vErr[0];
            }
        );
    }

    if (form) {
        form.setErrors({
            ...errorsObj,
            api: messageErr
        });
    } else {
        if(messageErr) dialog.error(messageErr);
        else if (defaultDialogMessage) dialog.error(defaultDialogMessage);
    }
}

function findNestedObj(entireObj, keyToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
      if (nestedValue && nestedValue[keyToFind] !== undefined) {
        foundObj = nestedValue;
      }
      return nestedValue;
    });
    return foundObj;
  };