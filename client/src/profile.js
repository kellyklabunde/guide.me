import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";

export default function Profile({
    first,
    image,
    last,
    toggleModal,
    bio,
    updateUser,
}) {
    console.log(first, last, image, toggleModal, bio);

    return (
        <div className="profile">
            <ProfilePic
                first={first}
                image={image || "/images/profile.png"}
                last={last}
                toggleModal={toggleModal}
            />
            <div className="profileInfo">
                <h2>
                    {first} {last}
                </h2>
                <BioEditor bio={bio} updateUser={updateUser} />
            </div>
        </div>
    );
}
