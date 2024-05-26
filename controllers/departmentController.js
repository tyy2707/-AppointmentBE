const Department = require('../models/departmentModel')
const Branch= require('../models/branchModel')

const departmentController = {
    getListDepartment: async (req, res) => {
        try {
            const { keyword, branch } = req.query;
            let query = {};
            if (keyword) {
                query = {
                    $or: [
                        { name: { $regex: keyword, $options: 'i' } },
                    ]
                };
                const listDataDP = await Department.find(query);
        
                // Extract all branchId values from listDataDP
                const branchIds = listDataDP.map(department => department.branchId);
        
                // Find branch information for the extracted branchIds
                const branchData = await Branch.find({ _id: { $in: branchIds } });
        
                // Create a map for quick lookup of branch information by branchId
                const branchMap = branchData.reduce((map, branch) => {
                    map[branch._id] = branch;
                    return map;
                }, {});
        
                // Attach branch information to the departments
                const listDataDT = listDataDP.map(department => {
                    const branchInfo = branchMap[department.branchId];
                    return {
                        ...department._doc, // Spread the department document fields
                        branchInfo,        // Add the branch information
                    };
                });
                res.json(listDataDT);

            }
            if (branch) {
                query.branchId = branch;
            }
            const listData = await Department.find(query);
            res.json(listData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getListDepartmentForDoctor: async (req, res) => {
        try {
            const { branchId, doctorId } = req.query;
            if (branchId && doctorId) {
                const departments = await Department.find({ branchId }).lean();
                let filteredDepartments = [];
                departments.forEach((department) => {
                    if (department.doctorIds.includes(doctorId)) {
                        filteredDepartments.push(department);
                    }
                });
                res.json(filteredDepartments);
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    createDepartment: async (req, res) => {
        try {
            const { branchId, name, doctorIds } = req.body;
            const existingObject = await Department.findOne({ branchId, name });
            if (existingObject) {
                return res.status(202).json({ status: 201, message: 'Tên khoa đã tồn tại' });
            }
            const newObject = new Department({ branchId, name, doctorIds });
            const savedData = await newObject.save();
            res.status(201).json(savedData);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    updateDepartment: async (req, res) => {
        try {
            const { _id, name, doctorIds } = req.body;
            const existingObject = await Department.findById(_id);
            if (existingObject) {
                existingObject.name = name;
                existingObject.doctorIds = doctorIds;
                // Lưu thay đổi
                await existingObject.save();
                // Trả về thông tin đã cập nhật
                return res.status(200).json(existingObject);
            }

            // Trả về lỗi nếu không tồn tại
            return res.status(404).json({ error: 'Department not found' });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    deleteDepartment: async (req, res) => {
        try {
            const { _id } = req.body;
            // Kiểm tra xem department tồn tại không
            const existingDepartment = await department.findById(_id);
            if (!existingDepartment) {
                // Nếu department không tồn tại, trả về lỗi
                return res.status(404).json({ error: 'Department not found' });
            }

            // Nếu department tồn tại, tiến hành xóa
            await department.findByIdAndDelete(_id);
            // Trả về thông báo thành công
            return res.status(200).json({ message: 'Department deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
}
module.exports = departmentController;