
const categories = [
    { id: 1 , name: '90642062 ALL ABOUT FOOD',code: 'rgb(7,166,166)' },
    { id: 2 , name: '90643004 POSITIVE POWER LEADER',code: 'rgb(189, 111, 117)' },
    { id: 3 , name: '90642148 ARTS OF EMOTION DEVELOPMENT',code: 'rgb(64, 159, 229)' },
    { id: 4 , name: '90642153 UNDERSTANDING HUMAN BEHAVIOR',code: 'rgb(166,73,29)' },
    { id: 5 , name: '90643010 CONTEMPORARY MARKETING',code: 'rgb(183,28,111)' }
]; 


const getAllCategory = async (req, res) => {
    try {
      res.status(200).json(categories)
    } catch (error) {
      console.error('Error category:', error);
      res.status(500).json({ error: 'An error cant fond category' });
    }
}

const getColorCategoryByName = async (req, res) => {
  try {
    const { name } = req.params
    const category = categories.find(category => category.name === name);
    if (category) {
      res.status(200).json(category.code);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error category:', error);
    res.status(500).json({ error: 'An error occurred while finding the category' });
  }
}
module.exports = {  
    getAllCategory,
    getColorCategoryByName           
}