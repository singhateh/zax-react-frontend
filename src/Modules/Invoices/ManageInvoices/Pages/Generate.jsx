import React, { useState } from "react";

import SortableTable from "../../../../Global/components/SortableTable";

function Generate() {
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    practiceOrCompany: "",
    postcode: "",
    address1: "",
    address2: "",
    address3: "",
    country: "",
    town: "",
  });

  const columns = [
    {
      key: "name",
      label: "Name",
    },
  ];

  const data = [
    {
      id: 1,
      name: 1234,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePostcodeLookup = () => {
    console.log("Postcode Lookup:", formData.postcode);
    alert("Postcode lookup functionality to be implemented.");
  };
  return (
    <div className="mt-40">
      <SortableTable columns={columns} data={data} />
    </div>
    // <div className="p-6">
    //   <Accordion title="Collapse to Search Case">
    //     <SearchForm />
    //   </Accordion>
    //   <Accordion title="Your Details">
    //     {/* Title */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Title <span className="text-red-500">*</span>
    //         </label>
    //         <select
    //           name="title"
    //           className="form-select w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.title}
    //           onChange={handleChange}
    //         >
    //           <option value="">~Please Select~</option>
    //           <option value="Mr">Mr</option>
    //           <option value="Ms">Ms</option>
    //           <option value="Mrs">Mrs</option>
    //           <option value="Miss">Miss</option>
    //           <option value="Master">Master</option>
    //           <option value="Dr">Dr</option>
    //           <option value="Prof">Prof</option>
    //           <option value="Rev">Rev</option>
    //           <option value="Other">Other</option>
    //         </select>
    //       </div>

    //       {/* First Name */}
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           First Name <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           type="text"
    //           name="firstName"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.firstName}
    //           onChange={handleChange}
    //         />
    //       </div>

    //       {/* Middle Name */}
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Middle Name
    //         </label>
    //         <input
    //           type="text"
    //           name="middleName"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.middleName}
    //           onChange={handleChange}
    //         />
    //       </div>

    //       {/* Last Name */}
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Last Name <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           type="text"
    //           name="lastName"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.lastName}
    //           onChange={handleChange}
    //         />
    //       </div>
    //     </div>

    //     {/* Practice/Company */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Practice/Company
    //         </label>
    //         <input
    //           type="text"
    //           name="practiceOrCompany"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.practiceOrCompany}
    //           onChange={handleChange}
    //         />
    //       </div>
    //     </div>

    //     {/* Postcode Lookup */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Post Code <span className="text-red-500">*</span>
    //         </label>
    //         <div className="input-group">
    //           <input
    //             type="text"
    //             name="postcode"
    //             className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //             value={formData.postcode}
    //             onChange={handleChange}
    //           />
    //           <button
    //             type="button"
    //             className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    //             onClick={handlePostcodeLookup}
    //           >
    //             <i className="fa fa-search"></i> Lookup
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Address Fields */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Address 1 <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           type="text"
    //           name="address1"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.address1}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Address 2 <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           type="text"
    //           name="address2"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.address2}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Address 3
    //         </label>
    //         <input
    //           type="text"
    //           name="address3"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.address3}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           Country
    //         </label>
    //         <input
    //           type="text"
    //           name="country"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.country}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700">
    //           City/Town
    //         </label>
    //         <input
    //           type="text"
    //           name="town"
    //           className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
    //           value={formData.town}
    //           onChange={handleChange}
    //         />
    //       </div>
    //     </div>
    //   </Accordion>
    // </div>
  );
}

export default Generate;
