class Vec3 { 
    // Constructor 
    constructor(x, y, z) 
    { this.x = x;
      this.y = y; 
      this.z = z;
    }
  

    min()
    {
      var result = this.x;
      if (result > this.y)
      {
        result = this.y;
      }
      if (result > this.z)
      {
        result = this.z;
      }

      return result;
    }

   max()
    {
      var result = this.x;
      if (result < this.y)
      {
        result = this.y;
      }
      if (result < this.z)
      {
        result = this.z;
      }

      return result;
    }

    mid()
    {
      var result;

      if (this.x != this.min() && this.x == this.max())
      {
        result = this.x;
      }
      else if (this.y != this.min() && this.y == this.max())
      {
        result = this.y;
      }
      else if (this.z != this.min() && this.z == this.max())
      {
        result = this.z;
      }

      return result;
    }

  }

