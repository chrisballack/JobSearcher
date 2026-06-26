export const mockGetFavoritesUseCase = {
  execute: jest.fn().mockResolvedValue([]),
};

export const mockToggleFavoriteUseCase = {
  execute: jest.fn().mockResolvedValue([]),
};

export const ServiceFactory = {
  getInstance: jest.fn().mockReturnValue({
    getGetFavoritesUseCase: jest.fn(() => mockGetFavoritesUseCase),
    getToggleFavoriteUseCase: jest.fn(() => mockToggleFavoriteUseCase),
  }),
};
