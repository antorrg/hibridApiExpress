import React from "react";

const ActionButtons = (submitFunction, permit, acceptText, retryFunction, retryText) => {
    const accept = acceptText? acceptText : 'Submit'
    const retry =retryText? retryText : 'Cancel'
  return (
    <div className="d-flex flex-row me-3">
      <button
        className="btn btn-md btn-secondary mb-3 me-2"
        onClick={retryFunction}
      >
        {retry}
      </button>
      <button
        className="btn btn-md btn-primary mb-3 me-2"
        type="button"
        onClick={submitFunction}
        disabled={permit}
      >
       {accept}
      </button>
    </div>
  );
};

export default ActionButtons;
