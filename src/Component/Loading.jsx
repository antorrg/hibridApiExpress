

const Loading = () => {
  return (
    <div style={{display:'flex', flexDirection:'row', justifyContent:'center',alignItems:'center', height:'100vh', width: '100vw'}}>
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Loading;
