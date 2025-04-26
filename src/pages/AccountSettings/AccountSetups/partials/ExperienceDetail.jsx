export default function ExperienceDetail({ doctor }) {

    const professionalInfo = doctor?.professionalInfo || {};

    return (
        <div>
            <label className="block text-sm font-medium">Experience Description</label>
            <textarea
                value={professionalInfo.experience}
                placeholder="Enter Experience Description"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={2}
            />
        </div>
    );
}