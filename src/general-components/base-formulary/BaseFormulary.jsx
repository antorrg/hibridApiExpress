

const BaseFormulary = ({ children, title='' }) => {
  return (
    <div className="coverBack">
      <div className="container-md modal-content colorBack backgroundFormColor formProductContainer rounded-4 shadow">
        <div className="container mt-5">
          <h3>{title}</h3>
          <section className="needs-validation" id="updateForm" noValidate>
            {children}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BaseFormulary;
