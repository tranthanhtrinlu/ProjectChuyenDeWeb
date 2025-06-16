//package vn.trijava.springrest.service;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.stereotype.Service;
//
//import vn.trijava.springrest.domain.Company;
//import vn.trijava.springrest.domain.Role;
//import vn.trijava.springrest.domain.User;
//import vn.trijava.springrest.domain.response.ResCreateUserDTO;
//import vn.trijava.springrest.domain.response.ResUpdateUserDTO;
//import vn.trijava.springrest.domain.response.ResUserDTO;
//import vn.trijava.springrest.domain.response.ResultPaginationDTO;
//import vn.trijava.springrest.repository.UserRepository;
//
//@Service
//public class UserService {
//
//    private final UserRepository userRepository;
//    private final CompanyService companyService;
//    private final RoleService roleService;
//
//    public UserService(UserRepository userRepository,
//            CompanyService companyService,
//            RoleService roleService) {
//        this.userRepository = userRepository;
//        this.companyService = companyService;
//        this.roleService = roleService;
//    }
//
//    public User handleCreateUser(User user) {
//        // check company
//        if (user.getCompany() != null) {
//            Optional<Company> companyOptional = this.companyService.findById(user.getCompany().getId());
//            user.setCompany(companyOptional.isPresent() ? companyOptional.get() : null);
//        }
//
//        // check role
//        if (user.getRole() != null) {
//            Role r = this.roleService.fetchById(user.getRole().getId());
//            user.setRole(r != null ? r : null);
//        }
//
//        return this.userRepository.save(user);
//    }
//
//    public void handleDeleteUser(long id) {
//        this.userRepository.deleteById(id);
//    }
//
//    public User fetchUserById(long id) {
//        Optional<User> userOptional = this.userRepository.findById(id);
//        if (userOptional.isPresent()) {
//            return userOptional.get();
//        }
//        return null;
//    }
//
//    public ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable) {
//        Page<User> pageUser = this.userRepository.findAll(spec, pageable);
//        ResultPaginationDTO rs = new ResultPaginationDTO();
//        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
//
//        mt.setPage(pageable.getPageNumber() + 1);
//        mt.setPageSize(pageable.getPageSize());
//
//        mt.setPages(pageUser.getTotalPages());
//        mt.setTotal(pageUser.getTotalElements());
//
//        rs.setMeta(mt);
//
//        // remove sensitive data
//        List<ResUserDTO> listUser = pageUser.getContent()
//                .stream().map(item -> this.convertToResUserDTO(item))
//                .collect(Collectors.toList());
//
//        rs.setResult(listUser);
//
//        return rs;
//    }
//
//    public User handleUpdateUser(User reqUser) {
//        User currentUser = this.fetchUserById(reqUser.getId());
//        if (currentUser != null) {
//            currentUser.setAddress(reqUser.getAddress());
//            currentUser.setGender(reqUser.getGender());
//            currentUser.setAge(reqUser.getAge());
//            currentUser.setName(reqUser.getName());
//
//            // check company
//            if (reqUser.getCompany() != null) {
//                Optional<Company> companyOptional = this.companyService.findById(reqUser.getCompany().getId());
//                currentUser.setCompany(companyOptional.isPresent() ? companyOptional.get() : null);
//            }
//
//            // check role
//            if (reqUser.getRole() != null) {
//                Role r = this.roleService.fetchById(reqUser.getRole().getId());
//                currentUser.setRole(r != null ? r : null);
//            }
//
//            // update
//            currentUser = this.userRepository.save(currentUser);
//        }
//        return currentUser;
//    }
//
//    public User handleGetUserByUsername(String username) {
//        return this.userRepository.findByEmail(username);
//    }
//
//    public boolean isEmailExist(String email) {
//        return this.userRepository.existsByEmail(email);
//    }
//
//    public ResCreateUserDTO convertToResCreateUserDTO(User user) {
//        ResCreateUserDTO res = new ResCreateUserDTO();
//        ResCreateUserDTO.CompanyUser com = new ResCreateUserDTO.CompanyUser();
//
//        res.setId(user.getId());
//        res.setEmail(user.getEmail());
//        res.setName(user.getName());
//        res.setAge(user.getAge());
//        res.setCreatedAt(user.getCreatedAt());
//        res.setGender(user.getGender());
//        res.setAddress(user.getAddress());
//
//        if (user.getCompany() != null) {
//            com.setId(user.getCompany().getId());
//            com.setName(user.getCompany().getName());
//            res.setCompany(com);
//        }
//        return res;
//    }
//
//    public ResUpdateUserDTO convertToResUpdateUserDTO(User user) {
//        ResUpdateUserDTO res = new ResUpdateUserDTO();
//        ResUpdateUserDTO.CompanyUser com = new ResUpdateUserDTO.CompanyUser();
//        if (user.getCompany() != null) {
//            com.setId(user.getCompany().getId());
//            com.setName(user.getCompany().getName());
//            res.setCompany(com);
//        }
//
//        res.setId(user.getId());
//        res.setName(user.getName());
//        res.setAge(user.getAge());
//        res.setUpdatedAt(user.getUpdatedAt());
//        res.setGender(user.getGender());
//        res.setAddress(user.getAddress());
//        return res;
//    }
//
//    public ResUserDTO convertToResUserDTO(User user) {
//        ResUserDTO res = new ResUserDTO();
//        ResUserDTO.CompanyUser com = new ResUserDTO.CompanyUser();
//        ResUserDTO.RoleUser roleUser = new ResUserDTO.RoleUser();
//        if (user.getCompany() != null) {
//            com.setId(user.getCompany().getId());
//            com.setName(user.getCompany().getName());
//            res.setCompany(com);
//        }
//
//        if (user.getRole() != null) {
//            roleUser.setId(user.getRole().getId());
//            roleUser.setName(user.getRole().getName());
//            res.setRole(roleUser);
//        }
//
//        res.setId(user.getId());
//        res.setEmail(user.getEmail());
//        res.setName(user.getName());
//        res.setAge(user.getAge());
//        res.setUpdatedAt(user.getUpdatedAt());
//        res.setCreatedAt(user.getCreatedAt());
//        res.setGender(user.getGender());
//        res.setAddress(user.getAddress());
//        return res;
//    }
//
//    public void updateUserToken(String token, String email) {
//        User currentUser = this.handleGetUserByUsername(email);
//        if (currentUser != null) {
//            currentUser.setRefreshToken(token);
//            this.userRepository.save(currentUser);
//        }
//    }
//
//    public User getUserByRefreshTokenAndEmail(String token, String email) {
//        return this.userRepository.findByRefreshTokenAndEmail(token, email);
//    }
//}

package vn.trijava.springrest.service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.trijava.springrest.domain.Company;
import vn.trijava.springrest.domain.Role;
import vn.trijava.springrest.domain.User;
import vn.trijava.springrest.domain.response.ResCreateUserDTO;
import vn.trijava.springrest.domain.response.ResUpdateUserDTO;
import vn.trijava.springrest.domain.response.ResUserDTO;
import vn.trijava.springrest.domain.response.ResultPaginationDTO;
import vn.trijava.springrest.repository.UserRepository;
import vn.trijava.springrest.service.CompanyService;
import vn.trijava.springrest.service.EmailService;
import vn.trijava.springrest.service.RoleService;
import vn.trijava.springrest.util.error.IdInvalidException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CompanyService companyService;
    private final RoleService roleService;
    private PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public UserService(
            UserRepository userRepository,
            CompanyService companyService,
            RoleService roleService,
            @Lazy PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.companyService = companyService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$");

    public User handleCreateUser(User user) throws IdInvalidException {
        if (isEmailExist(user.getEmail())) {
            throw new IdInvalidException("Email " + user.getEmail() + " đã tồn tại, vui lòng sử dụng email khác.");
        }
        // Validate password is now handled in AuthController
        if (user.getCompany() != null) {
            Optional<Company> companyOptional = this.companyService.findById(user.getCompany().getId());
            user.setCompany(companyOptional.isPresent() ? companyOptional.get() : null);
        }
        if (user.getRole() != null) {
            Role r = this.roleService.fetchById(user.getRole().getId());
            user.setRole(r != null ? r : null);
        }
        return this.userRepository.save(user);
    }

    public void handleDeleteUser(long id) {
        this.userRepository.deleteById(id);
    }

    public User fetchUserById(long id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        return userOptional.orElse(null);
    }

    public ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());
        rs.setMeta(mt);
        List<ResUserDTO> listUser = pageUser.getContent()
                .stream().map(this::convertToResUserDTO)
                .collect(Collectors.toList());
        rs.setResult(listUser);
        return rs;
    }

    public User handleUpdateUser(User reqUser) {
        User currentUser = this.fetchUserById(reqUser.getId());
        if (currentUser != null) {
            currentUser.setAddress(reqUser.getAddress());
            currentUser.setGender(reqUser.getGender());
            currentUser.setAge(reqUser.getAge());
            currentUser.setName(reqUser.getName());
            if (reqUser.getCompany() != null) {
                Optional<Company> companyOptional = this.companyService.findById(reqUser.getCompany().getId());
                currentUser.setCompany(companyOptional.isPresent() ? companyOptional.get() : null);
            }
            if (reqUser.getRole() != null) {
                Role r = this.roleService.fetchById(reqUser.getRole().getId());
                currentUser.setRole(r != null ? r : null);
            }
            currentUser = this.userRepository.save(currentUser);
        }
        return currentUser;
    }

    public User handleGetUserByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }

    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public ResCreateUserDTO convertToResCreateUserDTO(User user) {
        ResCreateUserDTO res = new ResCreateUserDTO();
        ResCreateUserDTO.CompanyUser com = new ResCreateUserDTO.CompanyUser();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setAge(user.getAge());
        res.setCreatedAt(user.getCreatedAt());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        if (user.getCompany() != null) {
            com.setId(user.getCompany().getId());
            com.setName(user.getCompany().getName());
            res.setCompany(com);
        }
        return res;
    }

    public ResUpdateUserDTO convertToResUpdateUserDTO(User user) {
        ResUpdateUserDTO res = new ResUpdateUserDTO();
        ResUpdateUserDTO.CompanyUser com = new ResUpdateUserDTO.CompanyUser();
        if (user.getCompany() != null) {
            com.setId(user.getCompany().getId());
            com.setName(user.getCompany().getName());
            res.setCompany(com);
        }
        res.setId(user.getId());
        res.setName(user.getName());
        res.setAge(user.getAge());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        return res;
    }

    public ResUserDTO convertToResUserDTO(User user) {
        ResUserDTO res = new ResUserDTO();
        ResUserDTO.CompanyUser com = new ResUserDTO.CompanyUser();
        ResUserDTO.RoleUser roleUser = new ResUserDTO.RoleUser();
        if (user.getCompany() != null) {
            com.setId(user.getCompany().getId());
            com.setName(user.getCompany().getName());
            res.setCompany(com);
        }
        if (user.getRole() != null) {
            roleUser.setId(user.getRole().getId());
            roleUser.setName(user.getRole().getName());
            res.setRole(roleUser);
        }
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setAge(user.getAge());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setCreatedAt(user.getCreatedAt());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        return res;
    }

    public void updateUserToken(String token, String email) {
        User currentUser = this.handleGetUserByUsername(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }

    public void validatePassword(String password) throws IdInvalidException {
        System.out.println("Validating password: " + password); // Thêm log
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IdInvalidException("Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất một chữ số và một ký tự đặc biệt");
        }
    }

    public void sendResetCode(String email) throws IdInvalidException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IdInvalidException("Email không tồn tại");
        }
        String resetCode = generateResetCode();
        user.setResetCode(resetCode);
        userRepository.save(user);
        emailService.sendResetCodeEmail(user.getEmail(), user.getName(), resetCode);
    }

    public void resetPassword(String resetCode, String newPassword) throws IdInvalidException {
        User user = userRepository.findByResetCode(resetCode)
                .orElseThrow(() -> new IdInvalidException("Mã đặt lại mật khẩu không hợp lệ"));
        validatePassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetCode(null);
        userRepository.save(user);
    }

    private String generateResetCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        return String.valueOf(code);
    }
}