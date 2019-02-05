class Cancha{
    constructor(newId, newDireccion,newLat, newLng, newNombre,newTelefono,newImg){
        this._newId=newId;
        this._newDireccion=newDireccion;
        this._newLat=newLat;
        this._newLng=newLng;
        this._newNombre=newNombre;
        this._newTelefono=newTelefono;
        this._newImg=newImg;

    }

    get img(){
        return this._newImg;
    }
    set img(newImg){
        this._newImg=newImg;    
    }
    get id(){
        return this._newId;
    }
    set id(newId){
        this._newId=newId;    
    }
    get nombre(){
        return this._newNombre;
    }
    set nombre(newNombre){
        this._newNombre=newNombre;        
    }
    get lat()
    {
        return this._newLat;
    }   
    set lat(newLat)
    {
            this._newLat=newLat;
    }
    get lng()
    {
        return this._newLng;
    }   
    set lng(newLng)
    {
            this._newLng=newLng;
    }
    get nombre()
    {
        return this._newNombre;
    }   
    set nombre(newNombre)
    {
            this._newNombre=newNombre;
    }
    get telefono()
    {
        return this._newTelefono;
    }   
    set telefono(newTelefono)
    {
            this._newTelefono=newTelefono;
    }
}