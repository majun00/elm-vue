const categoryData = require('../InitData/category')

module.exports = app => {
    const mongoose = app.mongoose

    const categorySchema = new mongoose.Schema({
        count: Number,
        id: Number,
        ids: [],
        image_url: String,
        level: Number,
        name: String,
        sub_categories: [{
            count: Number,
            id: Number,
            image_url: String,
            level: Number,
            name: String
        }, ]
    });

    categorySchema.static.addCategory = async function(type) {
        const categoryName = type.split('/')
        try {
            const allcate = await this.findOne()
            const subcate = await this.findOne({
                name: categoryName[0]
            })
            allcate.count++;
            subcate.count++;
            subcate.sub_categories.map(item => {
                if (item.name == categoryName[1]) {
                    return item.count++
                }
            })
            await allcate.save();
            await subcate.save();
            console.log('保存cetegroy成功');
            return
        } catch (err) {
            console.log('保存cetegroy失败');
            throw new Error(err)
        }

    }

    const Category = mongoose.model('Category', categorySchema)

    Category.findOne((err, data) => {
        if (!data) {
            for (let i = 0; i < categoryData.length; i++) {
                Category.create(categoryData[i])
            }
        }
    })

    return Category
}