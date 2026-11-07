const Goat = require('../../../models/Goat')
const db = require('../../../database/connect')

describe('Goat', () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe ('getAll', () => {
    it('resolves with goats on successful db query', async () => {
      // Arrange
      const mockGoats = [
        { id: 1, name: 'g1', age: 1 },
        { id: 2, name: 'g2', age: 2 },
        { id: 3, name: 'g3', age: 3 },
      ];

      // mockResolvedValue - it will return a fake data that we just created here
      //We are passing the mock data so we can test the actual methods
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockGoats });

      // Act
      //We are awaiting for information 
      const goats = await Goat.getAll();

      // Assert
      expect(goats).toHaveLength(3); // returns all the goats we have in the database, we expect this to be true
      expect(goats[0]).toHaveProperty('id'); 
      expect(goats[0].name).toBe('g1');
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM goats"); // we expect to have been called with something else
    });

    it('should throw an Error when no goats are found', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] }); 

      // Act & Assert
      await expect(Goat.getAll()).rejects.toThrow('No goats available.'); //we want to see how our method acts when there's an error
    });
  })



  describe ('findById', () => {
    it('resolves with goat on successful db query', async () => {
      // Arrange
      const testGoat = { id: 1, name: 'goat', age: 22 };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [testGoat] });

      // Act
      const result = await Goat.findById(1);

      // Assert
      expect(result).toBeInstanceOf(Goat);
      expect(result.name).toBe('goat');
      expect(result.id).toBe(1);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM goats WHERE id = $1', [1]);    
    });

    it('should throw an Error when goat is not found', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act & Assert
      await expect(Goat.findById(999)).rejects.toThrow('This goat does not exist!');
    });
  })

  describe('create', () => {
    it('resolves with goat on successful creation', async () => {
      // Arrange
      const goatData = { name: 'plum', age: 99 };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ ...goatData, id: 1 }] }); //spread operator

      // Act
      const result = await Goat.create(goatData); 

      // Assert (what do we want to test)
      expect(result).toBeInstanceOf(Goat);
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', 'plum');
      expect(result).toHaveProperty('age', 99);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO goats(name, age) VALUES ($1, $2) RETURNING *",
        [goatData.name, goatData.age]
      );
    });

    it('should throw an Error when age is missing', async () => {
      // Arrange
      const incompleteGoatData = { name: 'plum' };

      // Act & Assert 
      await expect(Goat.create(incompleteGoatData)).rejects.toThrow('age is missing');
    });
  })

  
  describe('update', () => {
    it('should return the updated goat on successful update', async () => {
      // Arrange
      const goat = new Goat({ id: 72, name: 'plum', age: 99 });
      const updatedData = { name: 'pear', age: 100 };
      const updatedGoat = { id: 72, ...updatedData };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedGoat] });

      // Act
      const result = await goat.update(updatedData);

      // Assert
      expect(result).toBeInstanceOf(Goat);
      expect(result.id).toBe(72);
      expect(result.name).toBe('pear');
      expect(result.age).toBe(100);
      expect(db.query).toHaveBeenCalledWith(
        " UPDATE goats SET name = $1, age = $2 WHERE id = $3 RETURNING * ",
        [updatedData.name, updatedData.age, goat.id]
      );
    });

    it('should throw an Error when age or name is missing', async () => {
      // Arrange
      const goat = new Goat({ id: 1, name: 'plum', age: 99 });
      const incompleteData = { name: 'puppet' };

      // Act & Assert
      await expect(goat.update(incompleteData)).rejects.toThrow('age or name missing');
    });

    it('should throw an Error on db query failure', async () => {
      // Arrange
      const goat = new Goat({ id: 72, name: 'plum', age: 99 });
      jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(goat.update({ name: 'pear', age: 100 })).rejects.toThrow('Database error');
    });
  })

  describe ('destroy', () => {
    it('should return the deleted goat on successful deletion', async () => {
      // Arrange
      const goat = new Goat({ id: 72, name: 'plum', age: 72 });
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ id: 72, name: 'plum', age: 72 }] });

      // Act
      const result = await goat.destroy();

      // Assert
      expect(result).toBeInstanceOf(Goat);
      expect(result.id).toBe(72);
      expect(result.name).toBe('plum');
      expect(result.age).toBe(72);
      expect(db.query).toHaveBeenCalledWith("DELETE FROM goats WHERE id = $1 RETURNING *", [goat.id]);
    });

    it('should throw an Error on db query failure', async () => {
      // Arrange
      const goat = new Goat({ id: 72, name: 'plum', age: 72 });
      jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(goat.destroy()).rejects.toThrow('Cannot delete.');
    });
  })
})
