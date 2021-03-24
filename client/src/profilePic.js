export default function ProfilePic({
    firstname,
    image,
    lastname,
    toggleModal,
}) {
    const fullName = firstname + " " + lastname;

    return (
        <>
            <img
                className="avatar"
                onClick={toggleModal}
                src={image || "/images/profile.png"}
                alt={fullName}
            />
        </>
    );
}
