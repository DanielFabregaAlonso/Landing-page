import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export function GalleryLightbox({ item, onClose }) {
  return (
    <Modal isOpen={Boolean(item)} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalCloseButton color="white" aria-label="Cerrar" />
        <ModalBody p={0}>
          {item && (
            <>
              <img src={item.src} alt={item.alt} style={{ width: "100%", display: "block" }} />
              <Text color="white" p={3} fontSize="sm">
                {item.alt}
              </Text>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
